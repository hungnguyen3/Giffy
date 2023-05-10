package com.adventuroushachi.Giffy.DTO;

import java.util.List;
import java.util.stream.Collectors;

import com.adventuroushachi.Giffy.Model.Giffy;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GiffyDTO {
    private Long giffyId;
    private Long collectionId;
    private String s3Url;
    private String s3Key;
    private String giffyName;

    public static GiffyDTO fromEntity(Giffy giffy) {
        return new GiffyDTO(
                giffy.getGiffyId(),
                giffy.getCollectionId(),
                giffy.getGiffyS3Url(),
                giffy.getGiffyS3Key(),
                giffy.getGiffyName()
        );
    }

    public static List<GiffyDTO> fromEntities(List<Giffy> giffies) {
        return giffies.stream()
                .map(GiffyDTO::fromEntity)
                .collect(Collectors.toList());
    }

}
