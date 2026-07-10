---
title: ChatBot Assistant
description: Intelligent conversational AI for automated customer support.
tech: [LangChain, OpenAI]
role: AI Developer
date: 2023-11-05
cover: /assets/img/project-placeholder.png
order: 5
---

## Overview

A support chatbot trained on a client's help-center content and order data, deployed to deflect repetitive tickets before they reached a human agent.

## The challenge

The support team was answering the same handful of order-status and policy questions dozens of times a day, leaving less time for genuinely complex cases.

## The approach

- Built a retrieval-augmented pipeline with LangChain, indexing the client's help docs so answers stayed grounded in real content instead of hallucinating policy details.
- Connected the bot to live order data so it could answer account-specific questions directly.
- Added a clear handoff path to a human agent whenever the model's confidence was low.

## The result

The bot resolved a majority of incoming questions without human involvement, and the support team reported spending noticeably more time on complex cases instead of repetitive ones.

## Stack

Python, LangChain, OpenAI, Pinecone.
