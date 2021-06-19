package org.hyperledger.fabric.samples.fabcar;

import com.owlike.genson.Context;
import com.owlike.genson.Converter;
import com.owlike.genson.convert.DefaultConverters;
import com.owlike.genson.Genson;
import com.owlike.genson.GensonBuilder;
import com.owlike.genson.stream.ObjectReader;
import com.owlike.genson.stream.ObjectWriter;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;

import java.math.BigInteger;

public class JsonConverters {
    public static Converter<BigInteger> BIG_INTEGER = new Converter<BigInteger>() {
        @Override
        public void serialize(BigInteger obj, ObjectWriter writer, Context ctx) throws Exception {
            if(obj == null) {
                writer.writeNull();
                return;
            }
            writer.writeBytes(obj.toByteArray());
        }

        @Override
        public BigInteger deserialize(ObjectReader reader, Context ctx) throws Exception {
            return new BigInteger(reader.valueAsByteArray());
        }
    };
    public static Converter<DateTime> DATE_TIME = new Converter<DateTime>() {
        @Override
        public void serialize(DateTime obj, ObjectWriter writer, Context ctx) throws Exception {
            if(obj == null) {
                writer.writeNull();
                return;
            }
            writer.writeValue(obj.toString("yyyy-MM-dd'T'HH:mm:ssZZ"));
        }

        @Override
        public DateTime deserialize(ObjectReader reader, Context ctx) {
            return DateTime.parse( reader.valueAsString(), DateTimeFormat.forPattern("yyyy-MM-dd'T'HH:mm:ssZZ"));
        }
    };

    public static Genson Genson() {
        return new GensonBuilder()
                .setSkipNull(true)
                .withConverter(JsonConverters.BIG_INTEGER, java.math.BigInteger.class)
                .withConverter(JsonConverters.DATE_TIME, org.joda.time.DateTime.class)
                .create();
    }
}
