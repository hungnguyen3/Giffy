package com.adventuroushachi.Giffy.Controller.Response;

public enum ResponseMessageStatus {
    SUCCESS("success"),
    ERROR("error");

    private final String status;

    ResponseMessageStatus(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}
