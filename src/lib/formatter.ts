export function extractLinks(text: string) {
  const urlRegex = /(?:https?:\/\/|www\.)[^\s]+/g;

  return text
    .replace(urlRegex, match => {
      let href = match;
      if (!href.startsWith('http')) {
        href = 'https://' + href;
      }
      return `<a href="${href}" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">${match}</a>`;
    })
    .replace(/\n/g, '<br />');
}

export const highlightLinks = (text: string) => {
  const urlRegex =
    /\b((https?:\/\/|www\.)[^\s]+?\.[a-z]{2,}(\/[^\s]*)?)(?=[\s]|$)/gi;

  return text
    .replace(
      urlRegex,
      match => `<span class="text-blue-500 underline">${match}</span>`,
    )
    .replace(/\n/g, '<br>');
};

export function extractLinks3(text: string): string {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

  return text.replace(urlRegex, match => {
    // Normalize YouTube links
    const ytMatch = match.match(
      /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/,
    );

    if (ytMatch) {
      const videoId = ytMatch[2];
      return `
        <div class="mt-2">
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video"
            frameborder="0"
            allowfullscreen
          ></iframe>
        </div>
      `;
    }

    const url = match.startsWith('http') ? match : `https://${match}`;
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline break-all">${match}</a>`;
  });
}

export function extractLinks4(text: string): string {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

  return text
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        return '<br />';
      }

      const ytMatch = trimmedLine.match(
        /(?:https?:\/\/)?(?:www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/,
      );

      if (ytMatch) {
        const videoId = ytMatch[2];
        return `
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="margin: 0px 0; display: block;"
          ></iframe>
        `;
      }

      // Handle normal URLs
      const lineWithLinks = trimmedLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${match}</a>`;
      });

      return `<span>${lineWithLinks}</span><br />`;
    })
    .join('');
}

export function extractLinks7(text: string): string {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

  return text
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();

      // Handle empty lines
      if (!trimmedLine) {
        return `<div style="height: 12px;"></div>`; // preserve empty lines with minimal height
      }

      // Handle YouTube links
      const ytMatch = trimmedLine.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/,
      );

      if (ytMatch) {
        const videoId = ytMatch[1];
        const textBefore = trimmedLine.replace(ytMatch[0], '').trim();

        return `
          ${
            textBefore
              ? `<div style="margin-bottom: 4px;">${textBefore}</div>`
              : ''
          }
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="margin-bottom: 12px; display: block;"
          ></iframe>
        `;
      }

      // Replace other URLs
      const lineWithLinks = trimmedLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${match}</a>`;
      });

      return `<div style="margin-bottom: 4px;">${lineWithLinks}</div>`;
    })
    .join('');
}

export function extractLinks6(text: string): string {
  const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

  return text
    .split('\n')
    .map(line => {
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Render empty lines with a small spacer
        return `<div style="height: 8px;"></div>`;
      }

      // YouTube video check
      const ytMatch = trimmedLine.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/,
      );

      if (ytMatch) {
        const videoId = ytMatch[1];
        const textBefore = trimmedLine.replace(ytMatch[0], '').trim();

        return `
          ${
            textBefore
              ? `<div style="margin-bottom: 4px;">${textBefore}</div>`
              : ''
          }
          <iframe
            width="100%"
            height="315"
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            style="margin: 0 0 8px 0; display: block;"
          ></iframe>
        `;
      }

      // Handle normal links
      const lineWithLinks = trimmedLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${match}</a>`;
      });

      return `<div style="margin-bottom: 4px;">${lineWithLinks}</div>`;
    })
    .join('');
}

export function extractLinks8(text: string): string {
  //const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
  const urlRegex =
    /\b((https?:\/\/|www\.)[^\s]+?\.[a-z]{2,}(\/[^\s]*)?)(?=[\s]|$)/gi;

  return text
    .split('\n')
    .map(line => {
      const originalLine = line;
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Render blank lines visibly
        return `<div style=" line-height:0.7; margin:0 0 8px 0;">&nbsp;</div>`;
      }

      // YouTube link handling
      //   const ytMatch = trimmedLine.match(
      //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/,
      //   );

      const ytFullMatch = trimmedLine.match(
        /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(?:\S+)?)/,
      );

      //   if (ytMatch) {
      //     const videoId = ytMatch[1];
      //     const textBefore = originalLine.replace(ytMatch[0], '').trim();

      //     return (
      //       (textBefore
      //         ? `<div style="line-height:1.4; margin:0 0 4px 0; padding:0;">${textBefore}</div>`
      //         : '') +
      //       `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin:0;padding:0;border:0;display:block;line-height:0;height:315px;"></iframe>`
      //     );
      //   }

      // Normal text with URLs

      if (ytFullMatch) {
        const fullUrl = ytFullMatch[0];

        // Extract video ID only
        const videoIdMatch = fullUrl.match(/(?:v=|be\/)([\w\-]{11})/);
        const videoId = videoIdMatch?.[1];

        const textBefore = trimmedLine.replace(fullUrl, '').trim();

        if (videoId) {
          return (
            (textBefore
              ? `<div style="margin:0 0 4px 0; padding:0;">${textBefore}</div>`
              : '') +
            `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin:0;padding:0;border:0;display:block;line-height:0;height:315px;"></iframe>` +
            `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline; line-height:1.4; display:block;">${fullUrl}</a>`
          );
        }
      }

      const lineWithLinks = originalLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">${match}</a>`;
      });

      return `<div style="margin:0; padding:0;">${lineWithLinks}</div>`;
    })
    .join('');
}

export function extractLinks9(text: string): string {
  //const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;
  const urlRegex =
    /\b((https?:\/\/|www\.)[^\s]+?\.[a-z]{2,}(\/[^\s]*)?)(?=[\s]|$)/gi;

  return text
    .split('\n')
    .map(line => {
      const originalLine = line;
      const trimmedLine = line.trim();

      if (!trimmedLine) {
        // Render blank lines visibly
        return `<div style="line-height:0.7; margin:0 0 8px 0;">&nbsp;</div>`;
      }

      // YouTube link handling
      //   const ytMatch = trimmedLine.match(
      //     /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})/,
      //   );

      const ytFullMatch = trimmedLine.match(
        /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w\-]{11}(?:\S+)?)/,
      );

      //   if (ytMatch) {
      //     const videoId = ytMatch[1];
      //     const textBefore = originalLine.replace(ytMatch[0], '').trim();

      //     return (
      //       (textBefore
      //         ? `<div style="line-height:1.4; margin:0 0 4px 0; padding:0;">${textBefore}</div>`
      //         : '') +
      //       `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin:0;padding:0;border:0;display:block;line-height:0;height:315px;"></iframe>`
      //     );
      //   }

      // Normal text with URLs

      if (ytFullMatch) {
        const fullUrl = ytFullMatch[0];

        // Extract video ID only
        const videoIdMatch = fullUrl.match(/(?:v=|be\/)([\w\-]{11})/);
        const videoId = videoIdMatch?.[1];

        const textBefore = trimmedLine.replace(fullUrl, '').trim();

        if (videoId) {
          return (
            (textBefore
              ? `<div style="line-height:1.4; margin:0 0 4px 0; padding:0;">${textBefore}</div>`
              : '') +
            `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin:0;padding:0;border:0;display:block;line-height:0;height:315px;"></iframe>` +
            `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline; line-height:1.4; display:block;">${fullUrl}</a>`
          );
        }
      }

      const lineWithLinks = originalLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">${match}</a>`;
      });

      return `<div style="line-height:1.4; margin:0; padding:0;">${lineWithLinks}</div>`;
    })
    .join('');
}

export function extractLinks2(text: string): string {
  const urlRegex =
    /\b((https?:\/\/|www\.)[^\s]+?\.[a-z]{2,}(\/[^\s]*)?)(?=[\s]|$)/gi;

  return text
    .split('\n')
    .map(line => {
      const originalLine = line;

      if (!originalLine.trim()) {
        return `<div style="line-height:0.7; margin:0 0 8px 0;">&nbsp;</div>`;
      }

      const ytMatch = originalLine.match(
        /((?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11}))(?:\S*)?/,
      );

      if (ytMatch) {
        const fullMatch = ytMatch[0]; // full matched URL
        const videoId = ytMatch[2]; // only the video ID
        const textBefore = originalLine.replace(fullMatch, '').trim();

        return (
          (textBefore
            ? `<div style="line-height:1.4; margin:0 0 4px 0; padding:0; white-space:pre-wrap;">${textBefore}</div>`
            : '') +
          `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="margin:0; margin-top:5px; margin-bottom:5px; padding:0;border:0;display:block;line-height:0;height:315px;"></iframe>` +
          `<a href="${fullMatch}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline; line-height:1.4; display:block;">${fullMatch}</a>`
        );
      }

      const lineWithLinks = originalLine.replace(urlRegex, match => {
        const href = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">${match}</a>`;
      });

      return `<div style="line-height:1.4; margin:0; padding:0; white-space:pre-wrap;">${lineWithLinks}</div>`;
    })
    .join('');
}

export const formatTimeAgo = (timestamp: string) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(timestamp).getTime()) / 1000,
  );

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
};
