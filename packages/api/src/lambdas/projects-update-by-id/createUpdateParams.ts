import createError from "../../middlewares/error-handler";

const createUpdateParams = (
    input: Record<string, string> | null,
    key: AWS.DynamoDB.DocumentClient.Key,
    tableName: string,
): AWS.DynamoDB.DocumentClient.UpdateItemInput => {

    if (!input || Object.keys(input).length < 1) {
        throw createError(400, "incorrect input supplied to createUpdateParams")
    }

    let updateExpression = 'set';
    const ExpressionAttributeNames: Record<string, string> = {};
    const ExpressionAttributeValues: Record<string, string> = {};

    Object.keys(input).forEach((key, idx) => {
        updateExpression += ` #${key} = :val${idx},`;
        ExpressionAttributeNames[`#${key}`] = key;
        ExpressionAttributeValues[`:val${idx}`] = input[key];
    });

    // Remove the last comma
    updateExpression = updateExpression.slice(0, -1);

    return {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "UPDATED_NEW"
    }
}

export default createUpdateParams