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
    const { flowchart_data, language = "javascript" } = req.body;

    if (!flowchart_data) {
      return res.status(400).json({ error: "Flowchart data is required" });
    }

    // Simple code generation based on flowchart elements
    let generatedCode = generateCodeFromFlowchart(flowchart_data, language);

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

function generateCodeFromFlowchart(flowchartData, language) {
  try {
    const elements = flowchartData.elements || [];

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
    const data = element.data || {};
    const label = data.label || "";
    const type = data.type || "";

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
      code += `    console.log(${label});\n`;
    }
  });

  if (hasStart) {
    code += `}\n\n// Call the main function\nmain();`;
  }

  return code;
}

function generatePythonCode(elements) {
  let code = `# Generated Python code from flowchart\n\n`;
  let hasStart = false;
  let variables = new Set();

  elements.forEach((element) => {
    const data = element.data || {};
    const label = data.label || "";
    const type = data.type || "";

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
      code += `    print(${label})\n`;
    }
  });

  if (hasStart) {
    code += `\nif __name__ == "__main__":\n    main()`;
  }

  return code;
}

function generateJavaCode(elements) {
  let code = `// Generated Java code from flowchart\nimport java.util.Scanner;\n\n`;
  code += `public class FlowchartProgram {\n`;
  code += `    public static void main(String[] args) {\n`;
  code += `        Scanner scanner = new Scanner(System.in);\n\n`;

  elements.forEach((element) => {
    const data = element.data || {};
    const label = data.label || "";
    const type = data.type || "";

    if (type === "process" || type === "rectangle") {
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
      code += `        System.out.println(${label});\n`;
    }
  });

  code += `\n        scanner.close();\n`;
  code += `    }\n`;
  code += `}`;

  return code;
}
