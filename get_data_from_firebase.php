<?php

// Firebase Realtime Database URL
$firebaseUrl = 'https://aaamin-53ef0-default-rtdb.firebaseio.com/';

// Path to the data you want to retrieve
$nodePath = 'sensorData'; // e.g., 'users', 'posts', etc.

// Construct the URL for the request
$requestUrl = $firebaseUrl . $nodePath . '.json';

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $requestUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}

// Close cURL session
curl_close($ch);

// Decode JSON response
$data = json_decode($response, true);

// Output the data
var_dump($data);


function generate_dummy_data($category) {
    $data = array();
    $data = array(
        "Accel-X" => round(mt_rand(-100, 100) / 100, 5),
        "Accel-Y" => round(mt_rand(-100, 100) / 100, 5),
        "Accel-Z" => round(mt_rand(900, 1000) / 100, 5),
        "Latt" => round(mt_rand(-900000000, 900000000) / 10000000, 9),
        "Long" => round(mt_rand(-1800000000, 1800000000) / 10000000, 9),
        "Rot-X" => round(mt_rand(-10, 10) / 100, 5),
        "Rot-Y" => round(mt_rand(-10, 10) / 100, 5),
        "Rot-Z" => round(mt_rand(-10, 10) / 100, 5),
        "Temp" => round(mt_rand(250000, 300000) / 10000, 5),
        "category"=> $category
    );    
    return $data;
}


$arr = array(
    array("warna" => 1, "bentuk" => 2, "ukuran" => 1,"category"=>"anggur"),  // Anggur: warna=1, bentuk=2, ukuran=1
    array("warna" => 2, "bentuk" => 1, "ukuran" => 2,"category"=>"anggur"),  // Anggur: warna=2, bentuk=1, ukuran=2
    array("warna" => 2, "bentuk" => 2, "ukuran" => 1,"category"=>"anggur"),  // Anggur: warna=2, bentuk=2, ukuran=1
    array("warna" => 1, "bentuk" => 1, "ukuran" => 2,"category"=>"anggur"),  // Anggur: warna=1, bentuk=1, ukuran=2
    array("warna" => 2, "bentuk" => 1, "ukuran" => 1,"category"=>"anggur"),  // Anggur: warna=2, bentuk=1, ukuran=1
    array("warna" => 1, "bentuk" => 2, "ukuran" => 2,"category"=>"anggur"),  // Anggur: warna=1, bentuk=2, ukuran=2
    array("warna" => 2, "bentuk" => 2, "ukuran" => 2,"category"=>"semangka"),  // Semangka: warna=2, bentuk=2, ukuran=2
    array("warna" => 3, "bentuk" => 2, "ukuran" => 2,"category"=>"semangka"),  // Semangka: warna=3, bentuk=2, ukuran=2
    array("warna" => 3, "bentuk" => 2, "ukuran" => 3,"category"=>"semangka"),  // Semangka: warna=3, bentuk=2, ukuran=3
    array("warna" => 2, "bentuk" => 2, "ukuran" => 3,"category"=>"semangka"),  // Semangka: warna=2, bentuk=2, ukuran=3
);

// for ($i=0; $i <30 ; $i++) { 
//     $c = ($i < 10) ? "duduk" : (($i < 20) ? "tidur" : "jatuh");
//     $arr[$i] = generate_dummy_data($c);
//     // print_r($arr[$i]);
//     // print("<br>");
// }


// Fungsi untuk melatih model Naive Bayes
function train_naive_bayes($training_data) {
    $class_counts = array();
    $class_feature_counts = array();
    $total_samples = count($training_data);

    // Hitung jumlah sampel untuk setiap kelas dan jumlah kemunculan fitur dalam setiap kelas
    foreach ($training_data as $data) {
        $class = $data['category'];

        if (!isset($class_counts[$class])) {
            $class_counts[$class] = 0;
            $class_feature_counts[$class] = array_fill_keys(array_keys($data), 0);
        }

        $class_counts[$class]++;
        foreach ($data as $feature => $value) {
            if ($feature !== 'category') {
                $class_feature_counts[$class][$feature] += $value;
            }
        }
    }
    // print_r($class_counts);

    // Hitung probabilitas prior untuk setiap kelas
    $class_priors = array();
    foreach ($class_counts as $class => $count) {
        $class_priors[$class] = $count / $total_samples;
    }

    // Hitung probabilitas kondisional untuk setiap fitur dalam setiap kelas
    $class_conditional_probs = array();
    foreach ($class_feature_counts as $class => $feature_counts) {
        // print_r($class);
        // print("<br>");

        // print_r($feature_counts);
        // print("<br>");
        $class_conditional_probs[$class] = array();
        foreach ($feature_counts as $feature => $count) {
            // print($class."-".$feature."-".$count."<br>");
            $class_conditional_probs[$class][$feature] = $count / $class_counts[$class];
        }
    }

    return array('priors' => $class_priors, 'conditionals' => $class_conditional_probs);
}

// Fungsi untuk mengklasifikasikan data uji menggunakan model Naive Bayes
function classify_naive_bayes($model, $sample) {
    $class_probs = array();

    // Hitung probabilitas posterior untuk setiap kelas
    foreach ($model['priors'] as $class => $prior) {
        $class_probs[$class] = $prior;
        foreach ($sample as $feature => $value) {
            if ($feature !== 'category') {
                $class_probs[$class] *= isset($model['conditionals'][$class][$feature]) ? $model['conditionals'][$class][$feature] : 1;
            }
        }
    }

    // Kembalikan kelas dengan probabilitas posterior tertinggi
    arsort($class_probs);
    // print_r($class_probs);
    return key($class_probs);
}

// Data pelatihan
$training_data = $arr;

// Latih model Naive Bayes
$nb_model = train_naive_bayes($training_data);

// print_r($nb_model['priors']);
// print("<br>");
// print_r($nb_model['conditionals']);


$predicted_class = classify_naive_bayes($nb_model, array("warna" => 1, "bentuk" => 1, "ukuran" => 1));
// echo $predicted_class;



?>
