package com.adventuroushachi.Giffy.Service;

import java.net.URL;

public interface S3Service {
    URL generatePresignedUrl(String objectKey);
}
