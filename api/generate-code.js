export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      shapes,
      connections,
      flowchart_data,
      language = "javascript",
    } = req.body;

    // Log received data for debugging
    console.log("API received data:", {
      hasShapes: !!shapes,
      shapesCount: shapes?.length || 0,
      hasConnections: !!connections,
      connectionsCount: connections?.length || 0,
      hasFlowchartData: !!flowchart_data,
      language,
    });

    // Support both formats: new format (shapes, connections) and old format (flowchart_data)
    let elements, edges;
    if (shapes && connections !== undefined) {
      elements = shapes;
      edges = connections;
    } else if (flowchart_data) {
      elements = flowchart_data.elements || flowchart_data.shapes || [];
      edges = flowchart_data.edges || flowchart_data.connections || [];
    } else {
      console.log(
        "Missing data - shapes:",
        !!shapes,
        "connections:",
        !!connections,
        "flowchart_data:",
        !!flowchart_data
      );
      return res
        .status(400)
        .json({ error: "Flowchart data is required (shapes and connections)" });
    }

    // Simple code generation based on flowchart elements
    let generatedCode = generateCodeFromShapes(elements, edges, language);

    return res.status(200).json({
      success: true,
      code: generatedCode,
      language: language,
    });
  } catch (error) {
    console.error("Code generation error:", error);
    return res.status(500).json({
      error: "Failed to generate code",
      details: error.message,
    });
  }
}

function generateCodeFromShapes(elements, edges, language) {
  try {
    if (language.toLowerCase() === "python") {
      return generatePythonCode(elements);
    } else if (language.toLowerCase() === "java") {
      return generateJavaCode(elements);
    } else {
      return generateJavaScriptCode(elements);
    }
  } catch (error) {
    console.error("Error generating code:", error);
    return `// Error generating code: ${error.message}`;
  }
}

function generateJavaScriptCode(elements) {
  let code = `// Generated JavaScript code from flowchart\n\n`;
  let hasStart = false;
  let variables = new Set();

  elements.forEach((element) => {
    // Handle both data formats: element.data.type/label and element.type/text
    const type = element.type || element.data?.type || "";
    const label = element.text || element.data?.label || "";

    console.log("Processing element:", { type, label, elementId: element.id });

    if (type === "start" && !hasStart) {
      code += `function main() {\n`;
      hasStart = true;
    } else if (type === "process" || type === "rectangle") {
      if (label.includes("=")) {
        const varName = label.split("=")[0].trim();
        variables.add(varName);
        code += `    let ${label};\n`;
      } else {
        code += `    // ${label}\n`;
      }
    } else if (type === "decision" || type === "diamond") {
      code += `    if (${label}) {\n`;
      code += `        // True condition\n`;
      code += `    } else {\n`;
      code += `        // False condition\n`;
      code += `    }\n`;
    } else if (type === "input" || type === "parallelogram") {
      const varName = label.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      variables.add(varName);
      code += `    let ${varName} = prompt("${label}");\n`;
    } else if (type === "output" || type === "display") {
      code += `    console.log("${label}");\n`;
    } else if (type === "end") {
      code += `    // End of program\n`;
    }
  });

  if (hasStart) {
    code += `}\n\n// Call the main function\nmain();`;
  } else {
    // If no start found, generate simple code structure
    code += `// Main program logic\n`;
    if (code.includes("//")) {
      code += `console.log("Program executed successfully");`;
    }
  }

  return code;
}

function generatePythonCode(elements) {
  let code = `# Generated Python code from flowchart\n\n`;
  let hasStart = false;
  let variables = new Set();

  elements.forEach((element) => {
    // Handle both data formats: element.data.type/label and element.type/text
    const type = element.type || element.data?.type || "";
    const label = element.text || element.data?.label || "";

    if (type === "start" && !hasStart) {
      code += `def main():\n`;
      hasStart = true;
    } else if (type === "process" || type === "rectangle") {
      if (label.includes("=")) {
        const varName = label.split("=")[0].trim();
        variables.add(varName);
        code += `    ${label}\n`;
      } else {
        code += `    # ${label}\n`;
      }
    } else if (type === "decision" || type === "diamond") {
      code += `    if ${label}:\n`;
      code += `        # True condition\n`;
      code += `        pass\n`;
      code += `    else:\n`;
      code += `        # False condition\n`;
      code += `        pass\n`;
    } else if (type === "input" || type === "parallelogram") {
      const varName = label.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      variables.add(varName);
      code += `    ${varName} = input("${label}: ")\n`;
    } else if (type === "output" || type === "display") {
      code += `    print("${label}")\n`;
    } else if (type === "end") {
      code += `    # End of program\n`;
    }
  });

  if (hasStart) {
    code += `\nif __name__ == "__main__":\n    main()`;
  } else {
    code += `# Main program logic\nprint("Program executed successfully")`;
  }

  return code;
}

function generateJavaCode(elements) {
  let code = `// Generated Java code from flowchart\nimport java.util.Scanner;\n\n`;
  code += `public class FlowchartProgram {\n`;
  code += `    public static void main(String[] args) {\n`;
  code += `        Scanner scanner = new Scanner(System.in);\n\n`;

  elements.forEach((element) => {
    // Handle both data formats: element.data.type/label and element.type/text
    const type = element.type || element.data?.type || "";
    const label = element.text || element.data?.label || "";

    if (type === "start") {
      code += `        // ${label}\n`;
    } else if (type === "process" || type === "rectangle") {
      if (label.includes("=")) {
        code += `        // ${label}\n`;
        code += `        int ${label};\n`;
      } else {
        code += `        // ${label}\n`;
      }
    } else if (type === "decision" || type === "diamond") {
      code += `        if (${label}) {\n`;
      code += `            // True condition\n`;
      code += `        } else {\n`;
      code += `            // False condition\n`;
      code += `        }\n`;
    } else if (type === "input" || type === "parallelogram") {
      const varName = label.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      code += `        System.out.print("${label}: ");\n`;
      code += `        String ${varName} = scanner.nextLine();\n`;
    } else if (type === "output" || type === "display") {
      code += `        System.out.println("${label}");\n`;
    } else if (type === "end") {
      code += `        // ${label}\n`;
    }
  });

  code += `\n        scanner.close();\n`;
  code += `    }\n`;
  code += `}`;

  return code;
}
