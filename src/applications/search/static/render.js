// Render Functions

// ツイートを取得した後にこの関数が実行される
function render(tweets) {
  const output = document.getElementById("output");
  const { statuses } = tweets;

  output.innerHTML = "";
  output.className = "";

  statuses.forEach(function(status, index) {
    const { user } = status;

    // Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/template_strings
    output.innerHTML += `
      <div
        class="_content _tweet${status.is_dangerous ? "" : " _safe"}"
        id="t-${status.id}"
        data-index="${index}"
        data-is-dangerous="${status.is_dangerous}"
        onclick="toggle(${status.id})"
      >
        <div class="_profile">
          <div class="_icon">
            <img src="${user.profile_image_url}" />
          </div>
          <div class="_name">${user.name}</div>
          <div class="_screen_name">@${user.screen_name}</div>
          <div class="_id">${user.id}</div>
        </div>

        <div class="_text">
          ${status.text}
          ${renderMedia(status.extended_entities)}

          <div class="_status">
            <div class="_reaction">
              <span class="_retweet">
                <span class="_font_condense">}</span>
                ${status.retweet_count}
              </span>
              <span class="_favorite">
                <span class="_font_condense">—</span>
                ${status.favorite_count}
              </span>
            </div>
            <div class="_id">${status.id}</div>
            <div class="_time">
              ${new Date(status.created_at).toUTCString()}
            </div>
          </div>
        </div>

        ${renderEntities(status.entities)}
      </div>
    `;
  });
}

// Reference: https://developer.twitter.com/en/docs/tweets/data-dictionary/overview/extended-entities-object.html
function renderMedia(extendedEntities) {
  if (extendedEntities === undefined) {
    return "";
  }

  return `
    <div>
      <div class="_media">
        ${extendedEntities.media
          .map(function(media) {
            switch (media.type) {
              case "photo":
                return `
                <img src="${media.media_url}" />
              `;

              case "animated_gif":
              case "video":
                return `
                <video
                  src="${(function() {
                    const variant = media.video_info.variants.find(function(
                      variant
                    ) {
                      return variant.content_type === "video/mp4";
                    });

                    if (variant) {
                      return variant.url;
                    }

                    return media.video_info.variants[0].url;
                  })()}"
                  controls
                  muted
                  preload="metadata"
                ></video>
              `;

              default:
                return "";
            }
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderEntities(entities) {
  if (
    entities.user_mentions.length === 0 &&
    entities.hashtags.length === 0 &&
    entities.urls.length === 0
  ) {
    return "";
  }

  return `
    <div class="_column _tag_group">
      ${renderUserMentions(entities.user_mentions)}
      ${renderHashTags(entities.hashtags)}
      ${renderUrls(entities.urls)}
    </div>
  `;
}

function renderUserMentions(userMentions) {
  if (userMentions.length === 0) {
    return "";
  }

  return `
    <div>
      <div class="_column">
        ${userMentions
          .map(function(userMention) {
            return `
            <span class="_tag _background_primary">
            <span class="_font_condense">ë</span> @${userMention.screen_name}
            </span>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderHashTags(hashTags) {
  if (hashTags.length === 0) {
    return "";
  }

  return `
    <div>
      <div class="_column">
        ${hashTags
          .map(function(hashTag) {
            return `
            <span class="_tag _background_primary">
              <span class="_font_condense">a</span> ${hashTag.text}
            </span>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderUrls(urls) {
  if (urls.length === 0) {
    return "";
  }

  return `
    <div>
      <div class="_column">
        ${urls
          .map(function(url) {
            return `
            <span class="_tag _background_primary">
              <span class="_font_condense">Y</span> ${url.url}
            </span>
          `;
          })
          .join("")}
      </div>
    </div>
  `;
}
