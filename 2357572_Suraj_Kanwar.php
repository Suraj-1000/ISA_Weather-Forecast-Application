<!-- Suraj_Kanwar
2357572 -->


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather Information of the Past Week</title>
    <style>
        h1{
            text-align: center;
        }

        table {
        width: 80%; 
        margin: 20px auto; 
        border-collapse: collapse;
        margin-top: 20px;
        }

        th, td {
            padding: 12px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #ddd;
        }

       .back-button-box {
            padding: 10px;
            text-align: center;
            margin-top: 20px;
        }

        .back-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }

        p{
            text-align: center;
            font-size: 22px;
        }

    </style>
</head>
<body>
    <h1>Weather Information of the Past Week</h1>
    <table>
        <tr>
            <th>City</th>
            <th>Temperature (°C)</th>
            <th>Date/Time</th>
            <th>Pressure (hPa)</th>
            <th>Wind Speed (km/h)</th>
            <th>Humidity (%)</th>
        </tr>

        <?php
        if (isset($_GET['city'])) {
            
            $con = mysqli_connect("localhost", "root", "", "Suraj_2357572");

            $search_city = $_GET['city'];
            echo '<script>console.log("Data retrieved from the database:", "' . $search_city . '");</script>';
 
            if (!empty($search_city)) {
                $api_key = '7de9475040c10c841c2c7d3e598b0f52';
                $url = "https://api.openweathermap.org/data/2.5/weather?q=$search_city&appid=$api_key";

                $data = @file_get_contents($url); 
                if ($data !== false) {
                    $json = json_decode($data, true);

                    if (isset($json['name'], $json['main']['temp'], $json['main']['pressure'], $json['wind']['speed'], $json['main']['humidity'])) {
                        
                        $city = $json['name'];
                        $temperature = $json['main']['temp'];
                        $dt = $json['dt'];
                        $pressure = $json['main']['pressure'];
                        $wind_speed = $json['wind']['speed'];
                        $humidity = $json['main']['humidity'];


                        $insert_query = "INSERT INTO weather(city, temperature, dt, pressure, wind_speed, humidity) VALUES ('$city', $temperature, UNIX_TIMESTAMP(), $pressure, $wind_speed, $humidity)";
                        mysqli_query($con, $insert_query);
                    } else {
                        echo "<p>No weather data found for '$search_city'</p>";
                    }
                }
            } else {
                echo "<p>Please enter a city name</p>";
            }

            $sql = "SELECT city, DATE(FROM_UNIXTIME(dt)) AS date, AVG(temperature) AS avg_temp, AVG(pressure) AS avg_pressure, AVG(wind_speed) AS avg_wind_speed, AVG(humidity) AS avg_humidity, MIN(dt) AS dt
                    FROM weather
                    WHERE city='$search_city'
                    GROUP BY date
                    ORDER BY dt 
                    LIMIT 7";

            $result = mysqli_query($con, $sql);

            if (mysqli_num_rows($result) > 0) {
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>";
                    echo "<td>" . $row['city'] . "</td>";
                    echo "<td>" . round($row['avg_temp'] - 273.15) . " °C</td>";
                    $nepalTime = new DateTime();
                    $nepalTime->setTimestamp($row['dt']);
                    $nepalTime->setTimezone(new DateTimeZone('Asia/Kathmandu')); 

                    echo "<td>" . $nepalTime->format('Y-m-d H:i:s') . "</td>";
                    echo "<td>" . round($row['avg_pressure']) . " hPa</td>";
                    echo "<td>" . round($row['avg_wind_speed']) . " km/h</td>";
                    echo "<td>" . round($row['avg_humidity']) . " %</td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='7'>No weather data available for '$search_city'</td></tr>";
            }

            mysqli_close($con);
        }
        ?>
    </table>
    <div class="back-button-box">
        <a class="back-button" href="2357572_Suraj_Kanwar.html">Back to Search</a>
    </div>

</body>
</html>

