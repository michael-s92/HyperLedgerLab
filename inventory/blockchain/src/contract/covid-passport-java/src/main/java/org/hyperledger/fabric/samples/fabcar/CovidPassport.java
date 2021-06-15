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

import java.security.PublicKey;
import java.time.LocalDateTime;
import java.util.Date;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ChaincodeException;
import org.hyperledger.fabric.shim.ChaincodeStub;

import com.owlike.genson.Genson;
import org.hyperledger.fabric.shim.ledger.CompositeKey;
import org.joda.time.DateTime;

@Contract(name = "CovidPassportJava", info = @Info(title = "Covid passport contract", description = "The hyperlegendary covid passport", version = "0.0.1-SNAPSHOT", license = @License(name = "Apache 2.0 License")))
@Default
public final class CovidPassport implements ContractInterface {

    private final Genson genson = JsonConverters.Genson();

    /**
     * Placeholder for init function
     *
     * @param ctx the transaction context
     */
    @Transaction()
    public void init(final Context ctx) {
        // comment
    }

    @Transaction()
    public void doNothing(final Context ctx) {
        // comment
    }

    @Transaction()
    public void initLedger(final Context ctx) throws ChaincodeException {
        try {
            ChaincodeStub stub = ctx.getStub();
            Seeds seeds = Seeds.loadSeeds();
            if (seeds == null) {
                throw new ChaincodeException("seeds is null");
            }
            for (SeedTestFacility testFacility : seeds.getTestFacilities()) {
                stub.putStringState(testFacility.getId(), testFacility.getPublicKey());
            }
            for (Dhp validDhp : seeds.getValidDhps()) {
                stub.putState(validDhp.getId(), genson.serializeBytes(validDhp));
            }
        } catch (Exception e) {
            throw new ChaincodeException(e);
        }
    }

    @Transaction()
    public boolean uploadDhp(final Context ctx, final String encodedDhp) {
	try{
        ChaincodeStub stub = ctx.getStub();
        Dhp dhp = genson.deserialize(encodedDhp, Dhp.class);
        byte[] issCrtB = stub.getState(dhp.getData().getTestFacilityId());
        PublicKey issuerCert = Crypto.UnmarshalPublicKey(issCrtB);
        byte[] data = genson.serializeBytes(dhp.getData());
        Crypto.validateSignature(data, dhp.getSignature().getR(), dhp.getSignature().getS(), issuerCert);
        byte[] storeDhp = genson.serializeBytes(dhp);
        CompositeKey dhpCompKey = stub.createCompositeKey("patient~method", dhp.getData().getPatient(), dhp.getData().getMethod());
        stub.putState(dhpCompKey.toString(), storeDhp);
        return true;
 } catch (Exception e) {
            throw new ChaincodeException(e);
        }

    }

    @Transaction()
    public TestResult verifyResult(final Context ctx, final String patient, final String method) {	
	try{
        ChaincodeStub stub = ctx.getStub();
        CompositeKey dhpCompKey = stub.createCompositeKey("patient~method", patient, method);
        byte[] dhpB = stub.getState(dhpCompKey.toString());
        Dhp dhp = genson.deserialize(dhpB, Dhp.class);
        if(dhp.getData().getExpiryDate().isBeforeNow()) {
            return null;
        }
        return dhp.getData();

} catch (Exception e) {
            throw new ChaincodeException(e);
        }

    }
}
