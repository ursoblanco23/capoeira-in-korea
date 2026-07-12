package io.github.ursoblanco23.capoeira_in_korea_backend.common.util;

import java.time.LocalDate;

public class DateUtils {
    public static LocalDate parseDate(String date) {
        return  date != null && !date.isBlank()
                ? LocalDate.parse(date)
                : null;
    }

}
