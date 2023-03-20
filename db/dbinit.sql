CREATE TABLE urls(
       url_id INT PRIMARY KEY AUTO_INCREMENT, 
       org_url VARCHAR(500), 
       shortened_url VARCHAR(10), 
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password'; 
flush privileges;
