package com.adventuroushachi.Giffy.Model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Permission {
    READ("read"),
    WRITE("write"),
    ADMIN("admin");

    private final String value;
}
