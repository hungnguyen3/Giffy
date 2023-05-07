package com.adventuroushachi.function;

public class ResponseMessage<T> {
    private final String status;
    private final String message;
    private final T data;

    public ResponseMessage(ResponseMessageStatus status, String message, T data) {
        this.status = status.getStatus();
        this.message = message;
        this.data = data;
    }

    public String getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public T getData() {
        return data;
    }
}
