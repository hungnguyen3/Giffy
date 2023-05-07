package com.adventuroushachi.Giffy.Utils.Jwt;

import com.adventuroushachi.Giffy.Utils.Const;
import com.adventuroushachi.Giffy.Utils.Exception.InvalidAuthorizationException;
import com.google.gson.Gson;

import java.util.Base64;
import java.util.Map;

public class JwtUtils {
    private static final Base64.Decoder decoder = Base64.getUrlDecoder();

    public static String getAuthorizationJwt(Map<String, String> headers) {
        String authorization = headers.get(Const.AUTHORIZATION);

        if (authorization == null) {
            authorization = headers.get(Const.AUTHORIZATION);
            if (authorization == null) {
                throw new InvalidAuthorizationException();
            }
        }

        String[] authorizationSplit = authorization.split(" ");
        if (authorizationSplit.length != 2) {
            throw new InvalidAuthorizationException();
        }
        return authorizationSplit[1];
    }

    public static String decodePayload(String jwt) {
        String[] parts = jwt.split("\\.");
        if (parts.length < 3) {
            throw new InvalidAuthorizationException();
        }
        return new String(decoder.decode(parts[1]));
    }

    public static String getCognitoSubFromHeader(Map<String, String> headers, Gson gson) {
        String jwt = getAuthorizationJwt(headers);
        String payload = decodePayload(jwt);
        String cognitoSub = gson.fromJson(payload, JwtPayload.class).getCognitoSub();
        if (cognitoSub == null || cognitoSub.isEmpty()) {
            throw new InvalidAuthorizationException();
        }
        
        return cognitoSub;
    }
}
