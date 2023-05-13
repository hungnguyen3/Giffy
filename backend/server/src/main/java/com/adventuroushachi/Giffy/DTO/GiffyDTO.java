package com.adventuroushachi.Giffy.DTO;

import com.adventuroushachi.Giffy.Model.Giffy;
import com.adventuroushachi.Giffy.Service.S3Service;

import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiffyDTO {
    private Long giffyId;
    private Long collectionId;
    private String giffyS3Url;
    private String giffyS3Key;
    private String giffyName;

    public static GiffyDTO fromEntity(Giffy giffy, S3Service s3Service) {
        GiffyDTO dto = new GiffyDTO();
        dto.setGiffyId(giffy.getGiffyId());
        dto.setCollectionId(giffy.getCollectionId());
        dto.setGiffyName(giffy.getGiffyName());

        if (giffy.getGiffyS3Key() != null) {
            dto.setGiffyS3Key(giffy.getGiffyS3Key());
            dto.setGiffyS3Url(s3Service.generatePresignedUrl(giffy.getGiffyS3Key()).toString());
        }

        return dto;
    }

    public static List<GiffyDTO> fromEntities(List<Giffy> giffies, S3Service s3Service) {
        return giffies.stream()
                .map(giffy -> GiffyDTO.fromEntity(giffy, s3Service))
                .collect(Collectors.toList());
    }
}
