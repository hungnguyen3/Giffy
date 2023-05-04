package com.adventuroushachi.Giffy.Utils.Jwt;

import com.adventuroushachi.Giffy.Utils.Const;
import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtPayload {
    @SerializedName(Const.SUB_NAME)
    private String cognitoSub;
}
