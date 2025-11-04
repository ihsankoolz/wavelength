<template>
  <div class="artist-network-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner-border text-danger" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Building your artist network...</p>
    </div>

    <!-- Network Graph -->
    <div v-else class="network-wrapper">
      <!-- Info Icon -->
      <div
        class="info-icon"
        @mouseenter="showInfoPopup = true"
        @mouseleave="handleInfoLeave"
        @click="showInfoPopup = !showInfoPopup"
      >
        <i class="bi bi-info-circle-fill"></i>
      </div>

      <!-- Info Popup -->
      <div
        v-if="showInfoPopup"
        class="info-popup"
        @mouseenter="showInfoPopup = true"
        @mouseleave="showInfoPopup = false"
      >
        <h6 class="mb-2"><i class="bi bi-graph-up me-2"></i>Artist Discovery Network</h6>
        <p class="mb-2">
          This interactive visualization maps your music taste and discovers similar artists you
          might enjoy.
        </p>
        <div class="info-section">
          <strong>How It Works:</strong>
          <ul class="mb-2">
            <li><strong>Genre Matching (40%):</strong> Artists sharing your preferred genres</li>
            <li><strong>Follower Similarity (20%):</strong> Artists with comparable popularity</li>
            <li><strong>Shared Followers (30%):</strong> Artists followed by people like you</li>
            <li><strong>Music Catalog (10%):</strong> Active artists with quality content</li>
          </ul>
        </div>
        <div class="info-section">
          <strong>Interactive Controls:</strong>
          <ul class="mb-0">
            <li>🖱️ <strong>Drag</strong> nodes to explore connections</li>
            <li>🔍 <strong>Scroll</strong> to zoom in/out</li>
            <li>👆 <strong>Click</strong> artist nodes to view their profile</li>
            <li>✨ <strong>Hover</strong> over nodes for details</li>
          </ul>
        </div>
        <p class="mt-2 mb-0 text-muted small">
          Only showing artists with 35%+ similarity • Max 25 recommendations
        </p>
      </div>

      <svg ref="svgContainer" class="network-svg"></svg>

      <!-- Tooltip -->
      <div
        v-if="hoveredNode"
        class="network-tooltip"
        :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
      >
        <h6 class="mb-1">{{ hoveredNode.label }}</h6>
        <div class="tooltip-genres" v-if="hoveredNode.genres && hoveredNode.genres.length > 0">
          <i class="bi bi-music-note-beamed"></i>
          {{ hoveredNode.genres.slice(0, 3).join(', ') }}
        </div>
        <div class="tooltip-followers" v-if="hoveredNode.followerCount !== undefined">
          <i class="bi bi-people-fill"></i>
          {{ hoveredNode.followerCount }} followers
        </div>
        <div class="tooltip-similarity" v-if="hoveredNode.similarity">
          <i class="bi bi-graph-up"></i>
          {{ hoveredNode.similarity }}% match
        </div>
        <div class="tooltip-action" v-if="hoveredNode.type !== 'user'">
          <i class="bi bi-arrow-right-circle"></i>
          Click on node to view profile
        </div>
      </div>

      <!-- Legend -->
      <div class="network-legend">
        <div class="legend-item">
          <div class="legend-dot user-dot"></div>
          <span>Your Interests</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot followed-dot"></div>
          <span>Following</span>
        </div>
        <div class="legend-item">
          <div class="legend-dot similar-dot"></div>
          <span>Recommended</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { buildArtistNetwork } from '@/utils/artistSimilarity'

export default {
  name: 'ArtistNetworkGraph',
  props: {
    userId: {
      type: String,
      required: true,
    },
    allArtists: {
      type: Array,
      required: true,
    },
    userPreferences: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 800,
    },
    height: {
      type: Number,
      default: 600,
    },
  },
  data() {
    return {
      loading: true,
      simulation: null,
      hoveredNode: null,
      tooltipX: 0,
      tooltipY: 0,
      showInfoPopup: false,
    }
  },
  mounted() {
    this.initializeGraph()
  },
  beforeUnmount() {
    if (this.simulation) {
      this.simulation.stop()
    }
  },
  watch: {
    allArtists: {
      handler() {
        this.updateGraph()
      },
      deep: true,
    },
    userPreferences: {
      handler() {
        this.updateGraph()
      },
      deep: true,
    },
  },
  methods: {
    handleInfoLeave() {
      // Add a small delay before hiding to allow user to move to popup
      setTimeout(() => {
        // Only hide if not hovering over popup
        if (!this.showInfoPopup) {
          this.showInfoPopup = false
        }
      }, 100)
    },

    initializeGraph() {
      this.loading = true

      // Wait for next tick to ensure DOM is ready, then turn off loading and create network
      this.$nextTick(() => {
        setTimeout(() => {
          this.loading = false
          // Wait another tick for v-else to render the SVG
          this.$nextTick(() => {
            this.createNetwork()
          })
        }, 300)
      })
    },

    createNetwork() {
      // Check if ref is available
      if (!this.$refs.svgContainer) {
        console.warn('SVG container ref not available yet')
        return
      }

      // Build network data
      const { nodes, links } = buildArtistNetwork(
        this.userId,
        this.allArtists,
        this.userPreferences,
      )

      if (nodes.length === 0) {
        console.warn('No nodes to display in network graph')
        return
      }

      // Clear existing SVG content
      const svg = d3.select(this.$refs.svgContainer)
      svg.selectAll('*').remove()

      // Get container dimensions
      const container = this.$refs.svgContainer.parentElement
      const width = container.clientWidth || this.width
      const height = this.height

      // Set SVG dimensions
      svg.attr('width', width).attr('height', height)

      // Create main group for zooming/panning
      const g = svg.append('g')

      // Add zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
          g.attr('transform', event.transform)
        })

      svg.call(zoom)

      // Create force simulation
      this.simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(links)
            .id((d) => d.id)
            .distance((d) => {
              // Stronger connections = closer distance
              return 150 - d.strength * 50
            })
            .strength((d) => d.strength * 0.5),
        )
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force(
          'collision',
          d3.forceCollide().radius((d) => d.size + 15),
        )

      // Create links (edges)
      const link = g
        .append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('class', 'network-link')
        .attr('stroke', (d) => (d.type === 'primary' ? '#bb1814' : '#4CAF50'))
        .attr('stroke-opacity', (d) => 0.3 + d.strength * 0.4)
        .attr('stroke-width', (d) => 1 + d.strength * 3)

      // Create node groups
      const node = g
        .append('g')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'network-node')
        .call(
          d3
            .drag()
            .on('start', (event, d) => this.dragStarted(event, d))
            .on('drag', (event, d) => this.dragged(event, d))
            .on('end', (event, d) => this.dragEnded(event, d)),
        )
        .on('mouseover', (event, d) => this.showTooltip(event, d))
        .on('mouseout', () => this.hideTooltip())
        .on('click', (event, d) => this.handleNodeClick(d))

      // Add circles to nodes
      node
        .append('circle')
        .attr('r', (d) => d.size)
        .attr('fill', (d) => d.color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('class', 'node-circle')

      // Add labels to nodes
      node
        .append('text')
        .text((d) => d.label)
        .attr('class', 'node-label')
        .attr('dy', (d) => d.size + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '12px')
        .attr('font-weight', '600')
        .attr('pointer-events', 'none')

      // Update positions on simulation tick
      this.simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)

        node.attr('transform', (d) => `translate(${d.x},${d.y})`)
      })
    },

    updateGraph() {
      if (this.simulation) {
        this.simulation.stop()
      }
      this.createNetwork()
    },

    dragStarted(event, d) {
      if (!event.active) this.simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    },

    dragged(event, d) {
      d.fx = event.x
      d.fy = event.y
    },

    dragEnded(event, d) {
      if (!event.active) this.simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    },

    showTooltip(event, d) {
      this.hoveredNode = d
      const container = this.$refs.svgContainer.getBoundingClientRect()

      // Calculate tooltip position
      let x = event.clientX - container.left + 15
      let y = event.clientY - container.top - 10

      // Ensure tooltip doesn't go off-screen
      const tooltipWidth = 200 // min-width from CSS
      const tooltipHeight = 150 // estimated height

      // Adjust x if too far right
      if (x + tooltipWidth > container.width) {
        x = event.clientX - container.left - tooltipWidth - 15
      }

      // Adjust y if too far down
      if (y + tooltipHeight > container.height) {
        y = event.clientY - container.top - tooltipHeight
      }

      // Ensure minimum positions
      x = Math.max(10, x)
      y = Math.max(10, y)

      this.tooltipX = x
      this.tooltipY = y
    },

    hideTooltip() {
      this.hoveredNode = null
    },

    handleNodeClick(d) {
      if (d.type === 'user') return // Don't navigate for center node

      // Navigate to artist profile
      this.$router.push(`/artist/${d.id}`)
    },
  },
}
</script>

<style scoped>
.artist-network-container {
  width: 100%;
  position: relative;
  background: rgba(35, 35, 38, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: white;
}

.network-wrapper {
  position: relative;
  width: 100%;
}

.network-svg {
  display: block;
  cursor: grab;
  background: transparent;
}

.network-svg:active {
  cursor: grabbing;
}

/* Tooltip */
.network-tooltip {
  position: absolute;
  background: rgba(25, 23, 23, 0.95);
  border: 1px solid rgba(187, 24, 20, 0.5);
  border-radius: 12px;
  padding: 12px 16px;
  color: white;
  pointer-events: none;
  z-index: 1000;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.network-tooltip h6 {
  color: #bb1814;
  font-weight: 700;
  margin-bottom: 8px;
  font-size: 1rem;
}

.tooltip-genres,
.tooltip-followers,
.tooltip-similarity,
.tooltip-action {
  font-size: 0.85rem;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
}

.tooltip-action {
  color: #4caf50;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.tooltip-genres i,
.tooltip-followers i,
.tooltip-similarity i,
.tooltip-action i {
  color: #bb1814;
}

/* Info Icon */
.info-icon {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 36px;
  height: 36px;
  background: rgba(187, 24, 20, 0.9);
  border: 2px solid rgba(187, 24, 20, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.info-icon:hover {
  background: rgba(187, 24, 20, 1);
  border-color: #bb1814;
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(187, 24, 20, 0.5);
}

.info-icon i {
  color: white;
  font-size: 1.2rem;
}

/* Info Popup */
.info-popup {
  position: absolute;
  top: 65px;
  left: 20px;
  width: 320px;
  max-height: 450px;
  background: rgba(35, 35, 38, 0.95);
  border: 2px solid #bb1814;
  border-radius: 16px;
  padding: 16px;
  z-index: 9;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  animation: slideIn 0.3s ease;
  overflow-y: auto;
}

.info-popup::-webkit-scrollbar {
  width: 6px;
}

.info-popup::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.info-popup::-webkit-scrollbar-thumb {
  background: #bb1814;
  border-radius: 10px;
}

.info-popup::-webkit-scrollbar-thumb:hover {
  background: rgba(187, 24, 20, 0.8);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-popup h6 {
  color: #bb1814;
  font-weight: 600;
  border-bottom: 1px solid rgba(187, 24, 20, 0.3);
  padding-bottom: 6px;
  font-size: 0.95rem;
}

.info-popup p {
  font-size: 0.8rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.info-section {
  margin-bottom: 10px;
}

.info-section strong {
  color: #bb1814;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 4px;
}

.info-popup ul {
  margin: 0;
  padding-left: 18px;
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.85);
}

.info-popup ul li {
  margin-bottom: 3px;
}

.info-popup ul li strong {
  display: inline;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.info-popup .text-muted {
  color: rgba(255, 255, 255, 0.5) !important;
  font-style: italic;
}

/* Legend */
.network-legend {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(25, 23, 23, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  backdrop-filter: blur(10px);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  color: white;
  font-size: 0.85rem;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.user-dot {
  background: #bb1814;
}

.followed-dot {
  background: #667eea;
}

.similar-dot {
  background: #4caf50;
}

/* Node styling via D3 */
:deep(.network-node) {
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.network-node:hover .node-circle) {
  filter: brightness(1.3);
  stroke-width: 3px;
}

:deep(.network-node:hover .node-label) {
  font-size: 14px;
  font-weight: 700;
}

:deep(.network-link) {
  transition: all 0.2s ease;
}

/* Responsive */
@media (max-width: 768px) {
  .network-legend {
    top: 10px;
    right: 10px;
    padding: 8px 12px;
  }

  .legend-item {
    font-size: 0.75rem;
    margin-bottom: 6px;
  }

  .legend-dot {
    width: 10px;
    height: 10px;
  }

  .network-tooltip {
    min-width: 180px;
    padding: 10px 12px;
  }
}
</style>
