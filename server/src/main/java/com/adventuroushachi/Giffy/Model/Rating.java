package com.adventuroushachi.Giffy.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Rating {
    G("g"),
    PG("pg"),
    PG13("pg-13"),
    R("r"),
    NSFW("nsfw");

    private final String value;

    public static Rating fromValue(String value) {
        if (value == null) {
            return null;
        }

        for (Rating rating : Rating.values()) {
            if (rating.getValue().equalsIgnoreCase(value)) {
                return rating;
            }
        }

        throw new IllegalArgumentException("Invalid rating value: " + value);
    }
}
