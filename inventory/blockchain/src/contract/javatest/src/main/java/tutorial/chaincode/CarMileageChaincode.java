package tutorial.chaincode;

import com.google.gson.JsonObject;
import org.hyperledger.fabric.shim.ChaincodeBase;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyModification;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.IntStream;

public class CarMileageChaincode extends ChaincodeBase {


    private static Log LOG = LogFactory.getLog(CarMileageChaincode.class);

    public static final String INITLEDGER_FUNCTION = "initLedger";
    public static final String DONOTHING_FUNCTION = "doNothing";

    @Override
    public Response init(ChaincodeStub chaincodeStub) {
        return newSuccessResponse();
    }

    @Override
    public Response invoke(ChaincodeStub chaincodeStub) {

        String functionName = chaincodeStub.getFunction();
        LOG.info("function name: "+ functionName);


        List<String> paramList = chaincodeStub.getParameters();
        //IntStream.range(0,paramList.size()).forEach(idx -> LOG.info("value of param: " + idx  + " is: "+paramList.get(idx)));

        if (INITLEDGER_FUNCTION.equalsIgnoreCase(functionName)) {
            return initLedger(chaincodeStub, paramList);
        } else if (DONOTHING_FUNCTION.equalsIgnoreCase(functionName)) {
            return doNothing(chaincodeStub, paramList);
        }  

        return newErrorResponse(functionName + " function is currently not supported");
    }

    private Response initLedger(ChaincodeStub chaincodeStub, List<String> paramList) {
        return newSuccessResponse();
    }

    private Response doNothing(ChaincodeStub chaincodeStub, List<String> paramList) {
        return newSuccessResponse();
    }

    public static void main(String [] args){
        new CarMileageChaincode().start(args);
    }


}
