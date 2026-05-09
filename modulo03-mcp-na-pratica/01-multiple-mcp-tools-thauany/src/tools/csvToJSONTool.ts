import { tool } from "@langchain/core/tools";

import csvtojson from "csvtojson";
import { z } from "zod";

export const getCSVToJSONTool = () => {
  return tool(
    async ({ csvText }) => {
      const json = await csvtojson().fromString(csvText);
      console.log("CSV to JSON conversion finished:", json.length, "records");
      return JSON.stringify(json, null, 2);
    },
    {
      name: "csv_to_json",
      description:
        "Converts a CSV file to JSON format. Use this tool when you need to transform CSV data into JSON structure",
      schema: z.object({
        csvText: z.string().describe(
          "The CSV content as a string to be converted to JSON."
        ),
      }),
    }
  )
}