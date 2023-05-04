package com.adventuroushachi.Giffy.Utils.Exception;

public class InvalidAuthorizationException extends RuntimeException {
    private static final String DEFAULT_ERROR_MESSAGE = "Invalid authorization";

    public InvalidAuthorizationException() {
        super(DEFAULT_ERROR_MESSAGE);
    }

    public InvalidAuthorizationException(String message) {
        super(message);
    }
}
