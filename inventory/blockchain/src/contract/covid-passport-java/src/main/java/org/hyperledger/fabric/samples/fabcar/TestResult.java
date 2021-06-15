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

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;
import org.joda.time.DateTime;

@DataType()
public final class TestResult {

    @Property
    private final String testFacilityId;

    @Property()
    private final String patient;

    @Property()
    private final String method;

    @Property
    private final boolean result;

    @Property()
    private final DateTime date;

    @Property()
    private final DateTime expiryDate;

    public String getTestFacilityId() {
        return testFacilityId;
    }

    public String getPatient() {
        return patient;
    }

    public String getMethod() {
        return method;
    }

    public boolean getResult() {
        return result;
    }

    public DateTime getDate() {
        return date;
    }

    public DateTime getExpiryDate() {
        return expiryDate;
    }

    public TestResult(@JsonProperty("testFacilityId") final String testFacilityId, @JsonProperty("patient") final String patient,
            @JsonProperty("method") final String method, @JsonProperty("result") final boolean result,
            @JsonProperty("date") final DateTime date, @JsonProperty("expiryDate") final DateTime expiryDate) {
        this.testFacilityId = testFacilityId;
        this.patient = patient;
        this.method = method;
        this.result = result;
        this.date = date;
        this.expiryDate = expiryDate;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        TestResult other = (TestResult) obj;

        return Objects.deepEquals(new Object[] {getTestFacilityId(), getPatient(), getMethod(), getResult(), getDate(), getExpiryDate()},
                new Object[] {other.getTestFacilityId(), other.getPatient(), other.getMethod(), other.getResult(), getDate(), getExpiryDate()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTestFacilityId(), getPatient(), getMethod(), getResult(), getDate(), getExpiryDate());
    }
}
