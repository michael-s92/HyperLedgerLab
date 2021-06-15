/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

package org.hyperledger.fabric.samples.fabcar;

import com.owlike.genson.Genson;
import com.owlike.genson.annotation.JsonProperty;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.Objects;

@DataType()
public final class Seeds {

    public static final String HOSTED_SEEDS_URL = "https://storage.googleapis.com/milan-thesis-21/covid-passport/seeds-3x30.json";
    private static final Genson genson = JsonConverters.Genson();

    @Property
    private final SeedTestFacility[] testFacilities;

    @Property()
    private final Dhp[] validDhps;

    public SeedTestFacility[] getTestFacilities() {
        return testFacilities;
    }

    public Dhp[] getValidDhps() { return validDhps; }

    public Seeds(@JsonProperty("testFacilities") final SeedTestFacility[] testFacilities, @JsonProperty("validDHPs") final Dhp[] validDhps) {
        this.testFacilities = testFacilities;
        this.validDhps = validDhps;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Seeds other = (Seeds) obj;

        return Objects.deepEquals(new Object[] {getTestFacilities(), getValidDhps()},
                new Object[] {other.getTestFacilities(), other.getValidDhps()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTestFacilities(), getValidDhps());
    }

    private static String readAll(Reader rd) throws IOException {
        StringBuilder sb = new StringBuilder();
        int cp;
        while ((cp = rd.read()) != -1) {
            sb.append((char) cp);
        }
        return sb.toString();
    }

    public static JSONObject readJsonFromUrl(String url) throws IOException, JSONException {
        InputStream is = new URL(url).openStream();
        try {
            BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
            String jsonText = readAll(rd);
            JSONObject json = new JSONObject(jsonText);
            return json;
        } finally {
            is.close();
        }
    }

    public static Seeds loadSeeds() throws IOException {
        JSONObject seedsJson = readJsonFromUrl(Seeds.HOSTED_SEEDS_URL);
        return genson.deserialize(seedsJson.toString(), Seeds.class);
    }
}
