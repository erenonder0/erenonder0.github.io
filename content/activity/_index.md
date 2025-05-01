---
title: Activity
button1_text: See page source
button1_url: https://github.com/zetxek/adritian-demo/blob/main/content/activity/_index.md
button1_icon: icon-square-github

button2_text: Button 2
button2_url: https://linkedin.com/in/adrianmoreno
button2_icon: icon-face-smile

button3_text: Button 3
button3_url: https://linkedin.com/in/adrianmoreno
button3_icon: icon-circle-arrow-up

---

This is where you can highlight a bit over your activity. Years of total activity, specialization, etc.

The content in this intro comes from the `content/activity/_index.md` file.
These kind of content, the "index pages", are called "branch bundles". You can read more about [**sections and bundles** in Hugo's docs](https://gohugo.io/content-management/sections/#template-selection).

The content for each activity item (that you can click on the left) is defined in the `content/activity` folder, with one content item per activity, as in `job-1.md`, `job-2.md`, etc.

The content (text and URL) for the buttons below (where you can add links) comes from two different files, depending on where you see this content:
1. in the "activity" page (`/activity`): this is passed from the content file, in `/content/activity/_index.md`
2. in the home page (or another page), using shortcodes.

In both cases, the arguments that can be passed (either via shortcode or front matter arguments) are:
- button1: 
    - button1_text
    - button1_ url
    - button1_icon
- button2:
    - button2_text
    - button2_ url
    - button2_icon
- button3:
    - button3_text
    - button3_ url
    - button3_icon