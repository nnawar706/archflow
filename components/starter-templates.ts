import { MarkerType } from "@xyflow/react"

import {
  DEFAULT_EDGE_COLOR,
  NODE_COLORS,
  NODE_SHAPES,
  type CanvasEdge,
  type CanvasNode,
  type NodeShape,
} from "@/types/canvas"

export interface CanvasTemplate {
  id: string
  name: string
  description: string
  nodes: CanvasNode[]
  edges: CanvasEdge[]
}

export interface PendingTemplateImport {
  template: CanvasTemplate
  requestId: number
}

function shapeSize(shape: NodeShape) {
  const definition = NODE_SHAPES.find((entry) => entry.shape === shape)
  if (!definition) {
    throw new Error(`Unknown shape: ${shape}`)
  }
  return { width: definition.defaultWidth, height: definition.defaultHeight }
}

function colorPair(label: string) {
  const option = NODE_COLORS.find((entry) => entry.label === label)
  if (!option) {
    throw new Error(`Unknown node color: ${label}`)
  }
  return option
}

interface TemplateNodeInput {
  id: string
  shape: NodeShape
  label: string
  color: string
  x: number
  y: number
}

function templateNode({ id, shape, label, color, x, y }: TemplateNodeInput): CanvasNode {
  const { width, height } = shapeSize(shape)
  const { background, text } = colorPair(color)
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    width,
    height,
    data: { label, color: background, textColor: text, shape },
  }
}

function templateEdge(id: string, source: string, target: string): CanvasEdge {
  return {
    id,
    type: "canvasEdge",
    source,
    target,
    markerEnd: { type: MarkerType.ArrowClosed, color: DEFAULT_EDGE_COLOR, width: 18, height: 18 },
  }
}

export const CANVAS_TEMPLATES: CanvasTemplate[] = [
  {
    id: "microservices",
    name: "Microservices",
    description: "An API gateway routing requests to independent services backed by a shared database.",
    nodes: [
      templateNode({ id: "client", shape: "circle", label: "Client", color: "Neutral", x: 0, y: 160 }),
      templateNode({ id: "gateway", shape: "hexagon", label: "API Gateway", color: "Blue", x: 220, y: 140 }),
      templateNode({ id: "auth", shape: "pill", label: "Auth Service", color: "Purple", x: 500, y: 20 }),
      templateNode({ id: "orders", shape: "pill", label: "Order Service", color: "Purple", x: 500, y: 160 }),
      templateNode({ id: "inventory", shape: "pill", label: "Inventory Service", color: "Purple", x: 500, y: 300 }),
      templateNode({ id: "database", shape: "cylinder", label: "Database", color: "Green", x: 780, y: 200 }),
    ],
    edges: [
      templateEdge("e-client-gateway", "client", "gateway"),
      templateEdge("e-gateway-auth", "gateway", "auth"),
      templateEdge("e-gateway-orders", "gateway", "orders"),
      templateEdge("e-gateway-inventory", "gateway", "inventory"),
      templateEdge("e-orders-database", "orders", "database"),
      templateEdge("e-inventory-database", "inventory", "database"),
    ],
  },
  {
    id: "cicd-pipeline",
    name: "CI/CD Pipeline",
    description: "A build pipeline that carries a commit from source control through to production.",
    nodes: [
      templateNode({ id: "developer", shape: "circle", label: "Developer", color: "Neutral", x: 0, y: 120 }),
      templateNode({ id: "repo", shape: "cylinder", label: "Git Repository", color: "Orange", x: 220, y: 100 }),
      templateNode({ id: "ci", shape: "pill", label: "CI Server", color: "Blue", x: 480, y: 100 }),
      templateNode({ id: "build", shape: "rectangle", label: "Build", color: "Blue", x: 740, y: 0 }),
      templateNode({ id: "test", shape: "rectangle", label: "Test", color: "Blue", x: 740, y: 130 }),
      templateNode({ id: "deploy", shape: "pill", label: "Deploy", color: "Teal", x: 1000, y: 100 }),
      templateNode({ id: "production", shape: "hexagon", label: "Production", color: "Green", x: 1240, y: 80 }),
    ],
    edges: [
      templateEdge("e-dev-repo", "developer", "repo"),
      templateEdge("e-repo-ci", "repo", "ci"),
      templateEdge("e-ci-build", "ci", "build"),
      templateEdge("e-ci-test", "ci", "test"),
      templateEdge("e-build-deploy", "build", "deploy"),
      templateEdge("e-test-deploy", "test", "deploy"),
      templateEdge("e-deploy-production", "deploy", "production"),
    ],
  },
  {
    id: "event-driven",
    name: "Event-Driven System",
    description: "A producer publishes events through a broker to independent consumers and an event store.",
    nodes: [
      templateNode({ id: "producer", shape: "pill", label: "Producer Service", color: "Blue", x: 0, y: 140 }),
      templateNode({ id: "broker", shape: "hexagon", label: "Event Bus", color: "Orange", x: 280, y: 120 }),
      templateNode({ id: "consumer-a", shape: "pill", label: "Consumer A", color: "Purple", x: 580, y: 0 }),
      templateNode({ id: "consumer-b", shape: "pill", label: "Consumer B", color: "Purple", x: 580, y: 140 }),
      templateNode({ id: "event-store", shape: "cylinder", label: "Event Store", color: "Green", x: 580, y: 290 }),
    ],
    edges: [
      templateEdge("e-producer-broker", "producer", "broker"),
      templateEdge("e-broker-consumer-a", "broker", "consumer-a"),
      templateEdge("e-broker-consumer-b", "broker", "consumer-b"),
      templateEdge("e-broker-store", "broker", "event-store"),
    ],
  },
]
