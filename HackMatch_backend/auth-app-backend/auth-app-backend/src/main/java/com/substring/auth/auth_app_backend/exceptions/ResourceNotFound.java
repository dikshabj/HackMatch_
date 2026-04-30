package com.substring.auth.auth_app_backend.exceptions;

public class ResourceNotFound extends RuntimeException {
    public ResourceNotFound(String message){
        super(message);
    }

    public ResourceNotFound(){
        super("Resource not found!");
    }
}
