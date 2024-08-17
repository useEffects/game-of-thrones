import { Force } from 'd3-force';
import { quadtree, QuadtreeLeaf } from 'd3-quadtree';
import { DataLinkData, DataNodeData } from '../../types';

export function ellipseCollider() {
  let nodes: DataNodeData[] = [];

  const force: Force<DataNodeData, DataLinkData> = (alpha) => {
    const hardAlpha = alpha ** 0.5;

    // Create a quadtree to efficiently find potential node collisions.
    const tree = quadtree(
      nodes,
      (d) => d?.x || Number.NaN,
      (d) => d?.y || Number.NaN,
    );

    nodes.forEach((node) => {
      const w = node.width / 2;
      const h = node.height / 2;

      // Calculate the bounding box of the current node's collider area.
      const nx1 = node.position.x - w;
      const nx2 = node.position.x + w;
      const ny1 = node.position.y - h;
      const ny2 = node.position.y + h;

      // Visit each node in the quadtree to check for collisions with the current node.
      tree.visit((quad, x1, y1, x2, y2) => {
        // Skip non-leaf nodes because they will not represent individual nodes.
        if (quad.length) return;

        let quadNext: QuadtreeLeaf<DataNodeData> | undefined = quad;
        do {
          const quadNode = quadNext.data;
          // Check if the quadData is not the current node to avoid self-collision.
          if (quadNode !== node) {
            const w2 = quadNode.width / 2;
            const h2 = quadNode.height / 2;

            // Vector from node to other
            const dx = quadNode.x - node.position.x;
            const dy = quadNode.y - node.position.y;

            // Estimate minimum non-overlapping distance between ellipses
            const angle = Math.atan2(dy, dx);
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            // Adjusted radii considering the angle between ellipses
            const r = (w * h) / Math.hypot(h * cos, w * sin);
            const r2 = (w2 * h2) / Math.hypot(h2 * cos, w2 * sin);
            const minDist = r + r2;

            // Actual distance between node centers
            const dist = Math.hypot(dx, dy);

            // Calculate overlap depth
            const overlap = minDist - dist;

            // Check for overlap and calculate overlap depth
            if (overlap > 0) {
              // Calculate x-y displacement fractions
              // NOTE: this gives a circle-like displacement force
              const fracX = dx / dist;
              const fracY = dy / dist;

              // Apply displacement proportional to overlap and adjusted by hardAlpha
              const displacementX = fracX * overlap * hardAlpha;
              const displacementY = fracY * overlap * hardAlpha;

              node.position.x -= displacementX;
              node.position.y -= displacementY;
              quadNode.x += displacementX;
              quadNode.y += displacementY;
            }
          }

          // Move to the next node in the quadtree.
          quadNext = quadNext?.next;
        } while (quadNext && quadNext !== quad);

        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    });
  };

  force.initialize = (newNodes) => (nodes = newNodes);

  return force;
}

export default ellipseCollider;
