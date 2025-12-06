function getCurrentChannelId() {
    const player = document.querySelector('ytlr-player');
    if (!player || !player.__instance) return null;

    const root = player.__instance;
    const maxDepth = 6;
    const queue = [{ node: root, depth: 0 }];
    const visited = new WeakSet();
    visited.add(root);

    while (queue.length > 0) {
        const { node, depth } = queue.shift();

        if (node.videoDetails?.channelId) {
            return node.videoDetails.channelId;
        }

        if (node.browseEndpoint?.browseId?.startsWith('UC')) {
            return node.browseEndpoint.browseId;
        }

        if (depth >= maxDepth) continue;

        const keys = Object.keys(node);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = node[key];

            if (value && typeof value === 'object') {
                if (value instanceof Element || value === window) continue;

                if (!visited.has(value)) {
                    visited.add(value);
                    queue.push({ node: value, depth: depth + 1 });
                }
            }
        }
    }

    return null;
}

export default getCurrentChannelId;
