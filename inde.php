<?php
$conn = mysqli_connect('localhost', 'root', '', 'uacart');

if (isset($_GET['getProducts'])) {
    $query = "select * from products";
    $result = mysqli_query($conn, $query);
    if (!$result) {
        die('Error: ' . mysqli_error($conn));
    } else {

        $data = array();
        while ($row = mysqli_fetch_array($result)) {
            $data[] = array(
                'id' => $row['id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'price' => $row['price'],
                'stock' => $row['stock'],
            );
        }
    }
    echo json_encode($data);
}
if (isset($_POST['payOrder'])) {
    $dataArray = $_POST['payOrder'];
    $success = true;
    for ($i = 0; $i < count($dataArray); $i++) {
        $query = "update products set stock=stock-".$dataArray[$i]['quantity']." where id='".$dataArray[$i]['id']."'";
        $result = mysqli_query($conn, $query);
        if (!$result) {
            $success = false;
            $message = "Error al procesar la orden";
            break;
        }
    }
    echo json_encode($success);
}
