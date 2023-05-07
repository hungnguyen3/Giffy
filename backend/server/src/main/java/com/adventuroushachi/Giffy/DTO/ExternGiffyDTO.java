package com.adventuroushachi.Giffy.DTO;

import com.adventuroushachi.Giffy.Model.Rating;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExternGiffyDTO {
    private String externGiffyId;
    private String url;
    private Rating rating;
    private String externGiffyName;
}
