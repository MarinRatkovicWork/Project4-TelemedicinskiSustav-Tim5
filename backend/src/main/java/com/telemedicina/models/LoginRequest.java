package com.telemedicina.models;

public class LoginRequest {
    private String email;
    private String password;

    // Konstruktor bez argumenata
    public LoginRequest() {
    }

    // Konstruktor s argumenata
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getteri i setteri
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
