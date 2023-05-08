package com.adventuroushachi.function.DTO;

public class S3UploadDTO {
    private String s3Url;
    private String s3Key;

    public S3UploadDTO(String s3Url, String s3Key) {
        this.s3Url = s3Url;
        this.s3Key = s3Key;
    }

    public String getS3Url() {
        return s3Url;
    }

    public void setS3Url(String s3Url) {
        this.s3Url = s3Url;
    }

    public String getS3Key() {
        return s3Key;
    }

    public void setS3Key(String s3Key) {
        this.s3Key = s3Key;
    }
}
