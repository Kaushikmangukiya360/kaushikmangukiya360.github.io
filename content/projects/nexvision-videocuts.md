---
title: NexVision VideoCuts
description: AI-powered desktop application for automated video editing and highlight generation.
tech: [PyQt5, NocoDB, Python]
role: Solo Developer
date: 2024-09-10
cover: /assets/img/project-placeholder.png
featured: true
order: 2
---

## Overview

NexVision VideoCuts is a desktop application that turns long-form video into short, ready-to-post highlight clips automatically, built for a content-creation client with a growing backlog of raw footage.

## The challenge

The client's editing team was manually scrubbing hours of footage to find clip-worthy moments, which didn't scale as their content volume grew.

## The approach

- Built a PyQt5 desktop app so editors could work offline without relying on cloud upload for large video files.
- Used scene-detection and audio-energy heuristics to auto-suggest candidate highlight ranges.
- Stored clip metadata and review status in NocoDB so the team could track what had been exported and published.

## The result

The editing team cut their per-video review time significantly, spending their time confirming and trimming suggested clips instead of scrubbing raw footage from scratch.

## Stack

Python, PyQt5, NocoDB, FFmpeg.
