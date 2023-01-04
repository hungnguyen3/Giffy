package com.example.androidgiffy;

import com.google.gson.annotations.SerializedName;

import java.util.List;

public class DogResponse {

    @SerializedName("message")
    private List<String> mMessage;

    @SerializedName("status")
    private String mStatus;

    public List<String> getMessage() {
        return mMessage;
    }

    public void setMessage(List<String> message) {
        mMessage = message;
    }

    public String getStatus() {
        return mStatus;
    }

    public void setStatus(String status) {
        mStatus = status;
    }
}
