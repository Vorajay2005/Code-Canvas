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
    const { shapes, connections, flowchart_data } = req.body;

    // Support both formats: new format (shapes, connections) and old format (flowchart_data)
    let elements, edges;
    if (shapes && connections) {
      elements = shapes;
      edges = connections;
    } else if (flowchart_data) {
      elements = flowchart_data.elements || flowchart_data.shapes || [];
      edges = flowchart_data.edges || flowchart_data.connections || [];
    } else {
      return res
        .status(400)
        .json({ error: "Flowchart data is required (shapes and connections)" });
    }

    const analysis = analyzeFlowchart({ elements, edges });

    return res.status(200).json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Flowchart analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze flowchart",
      details: error.message,
    });
  }
}

function analyzeFlowchart(flowchartData) {
  try {
    const elements = flowchartData.elements || [];
    const edges = flowchartData.edges || [];

    let analysis = {
      summary: {
        total_elements: elements.length,
        total_connections: edges.length,
        element_types: {},
        complexity: "Simple",
      },
      issues: [],
      suggestions: [],
      flow_paths: [],
    };

    // Count element types
    elements.forEach((element) => {
      const type = element.data?.type || "unknown";
      analysis.summary.element_types[type] =
        (analysis.summary.element_types[type] || 0) + 1;
    });

    // Check for common issues
    const startElements = elements.filter((el) => el.data?.type === "start");
    const endElements = elements.filter((el) => el.data?.type === "end");

    if (startElements.length === 0) {
      analysis.issues.push({
        type: "missing_start",
        message: "Flowchart should have a start element",
        severity: "warning",
      });
    } else if (startElements.length > 1) {
      analysis.issues.push({
        type: "multiple_starts",
        message: "Flowchart has multiple start elements",
        severity: "warning",
      });
    }

    if (endElements.length === 0) {
      analysis.issues.push({
        type: "missing_end",
        message: "Flowchart should have an end element",
        severity: "warning",
      });
    }

    // Check for orphaned elements (no connections)
    const connectedElementIds = new Set();
    edges.forEach((edge) => {
      connectedElementIds.add(edge.source);
      connectedElementIds.add(edge.target);
    });

    elements.forEach((element) => {
      if (!connectedElementIds.has(element.id)) {
        analysis.issues.push({
          type: "orphaned_element",
          message: `Element "${
            element.data?.label || element.id
          }" is not connected to the flow`,
          severity: "info",
        });
      }
    });

    // Determine complexity
    if (elements.length > 20 || edges.length > 25) {
      analysis.summary.complexity = "Complex";
    } else if (elements.length > 10 || edges.length > 12) {
      analysis.summary.complexity = "Medium";
    }

    // Generate suggestions
    if (analysis.summary.element_types.decision > 5) {
      analysis.suggestions.push({
        type: "refactor",
        message:
          "Consider breaking down complex decision logic into smaller functions",
      });
    }

    if (analysis.summary.total_elements > 15) {
      analysis.suggestions.push({
        type: "modularity",
        message:
          "Consider splitting this flowchart into smaller, more manageable modules",
      });
    }

    // Simple flow path analysis
    if (startElements.length === 1) {
      analysis.flow_paths = findFlowPaths(elements, edges, startElements[0].id);
    }

    return analysis;
  } catch (error) {
    console.error("Error analyzing flowchart:", error);
    return {
      error: `Analysis failed: ${error.message}`,
      summary: { total_elements: 0, total_connections: 0 },
      issues: [],
      suggestions: [],
    };
  }
}

function findFlowPaths(elements, edges, startId) {
  // Simple path finding algorithm
  const visited = new Set();
  const paths = [];

  function dfs(currentId, currentPath) {
    if (visited.has(currentId)) {
      return;
    }

    visited.add(currentId);
    currentPath.push(currentId);

    const outgoingEdges = edges.filter((edge) => edge.source === currentId);

    if (outgoingEdges.length === 0) {
      // End of path
      paths.push([...currentPath]);
    } else {
      outgoingEdges.forEach((edge) => {
        dfs(edge.target, [...currentPath]);
      });
    }
  }

  try {
    dfs(startId, []);
    return paths.slice(0, 5); // Return first 5 paths to avoid overwhelming
  } catch (error) {
    return [];
  }
}
