<?php
function generate_fruit_data($type) {
    $data = array();
    switch ($type) {
        case "Anggur":
            $data = array(
                "warna" => 1, // Misalnya: 1 = ungu , 2 = Hijau,3.merah, 
                "bentuk" =>1, // Misalnya: 1 = Bulat, 2 = Oval
                "ukuran" => 1, // Misalnya: 1 = Kecil, 2 = Sedang
                "type" => $type
            );
            break;
        case "Semangka":
            $data = array(
                "warna" => 3, // Misalnya: 2 = Hijau, 3.merah 
                "bentuk" => 2, // Semangka umumnya oval
                "ukuran" => rand(2, 3), // Misalnya: 2 = Sedang, 3 = Besar
                "type" => $type
            );
            break;
    }
    return $data;
}

$fruit_arr = [];
for ($i = 0; $i < 20; $i++) {
    $c = ($i < 10) ? "Anggur" : "Semangka";
    $fruit_arr[$i] = generate_fruit_data($c);
    var_dump($fruit_arr[$i]);echo"<br>";
}

// Fungsi untuk melatih model Naive Bayes
function train_naive_bayes($training_data) {
    $class_counts = array();
    $class_feature_counts = array();
    $total_samples = count($training_data);

    // Hitung jumlah sampel untuk setiap kelas dan jumlah kemunculan fitur dalam setiap kelas
    foreach ($training_data as $data) {
        $class = $data['type'];

        if (!isset($class_counts[$class])) {
            $class_counts[$class] = 0;
            $class_feature_counts[$class] = array_fill_keys(array_keys($data), 0);
        }

        $class_counts[$class]++;
        foreach ($data as $feature => $value) {
            if ($feature !== 'type') {
                $class_feature_counts[$class][$feature] += $value;
            }
        }
    }

    // Hitung probabilitas prior untuk setiap kelas
    $class_priors = array();
    foreach ($class_counts as $class => $count) {
        $class_priors[$class] = $count / $total_samples;
    }

    // Hitung probabilitas kondisional untuk setiap fitur dalam setiap kelas
    $class_conditional_probs = array();
    foreach ($class_feature_counts as $class => $feature_counts) {
        $class_conditional_probs[$class] = array();
        foreach ($feature_counts as $feature => $count) {
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
            if ($feature !== 'type') {
                $class_probs[$class] *= isset($model['conditionals'][$class][$feature]) ? $model['conditionals'][$class][$feature] : 1;
            }
        }
    }

    // Kembalikan kelas dengan probabilitas posterior tertinggi
    // arsort($class_probs);
    return key($class_probs);
}


// Training model Naive Bayes
$fruit_nb_model = train_naive_bayes($fruit_arr);

// Fungsi untuk memprediksi buah
function predict_fruit($model, $sample) {
    return classify_naive_bayes($model, $sample);
}

// Contoh penggunaan
$sample_fruit = generate_fruit_data("Semangka");
$predicted_fruit = predict_fruit($fruit_nb_model, $sample_fruit);

echo "<br>";
echo "<br>";
var_dump($sample_fruit);
echo "<br>";
echo "Prediksi: " . $predicted_fruit;
