# JD Video

Initialization

```javascript
new jdVideo(HTMLElement, options);
```

| Option      | Type      | Default                | Description                                                  |
| ----------- | --------- | ---------------------- | ------------------------------------------------------------ |
| `prefix`    | `string`  | `jd`                   | Class prefix for element.                                    |
| `type`      | `string`  | `upload`               | Type of video. Example: `upload`, `youtube`, `vimeo`         |
| `src`       | `string`  | `null`                 | Source of video.<br />Examples:<br />Upload: `file.mp4` <br />Youtube: `youtubeUrl` or `youtubeID`<br />Vimeo: `vimeoUrl` or `vimeoID` |
| `thumbnail` | `string`  | `null`                 | Thumbnail Image, Automatically featch if no thumbnail selected. Example: `imageurl` |
| `overlay`   | `string`  | `null`                 | Overlay color for thumbnail. Example: `rgba(0, 0, 0, 0.2)`   |
| `size`      | `string`  | `16by9`                | Video size. Example: `16by9`, `21by9`, `4by3`, `1by1`        |
| `autoplay`  | `boolean` | `false`                | Autoplay video on load.                                      |
| `loop`      | `boolean` | `false`                | Loop video on finish.                                        |
| `muted`     | `boolean` | `false`                | Mute video on play.                                          |
| `controls`  | `boolean` | `true`                 | Display of controls on video. Note: On vimeo, Hide controls is not wokring on all videos. |
| `icon`      | `string`  | `<span>&#8227;</span>` | Play Icon HTML.                                              |
| `vimeo`     | `object`  | `{}`                   | Additional Vimeo options. Check all embed options [here](https://github.com/vimeo/player.js/#embed-options). |
| `youtube`   | `object`  | `{}`                   | Additional YouTube options. Check all embed option [here](https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5#Parameters). |

