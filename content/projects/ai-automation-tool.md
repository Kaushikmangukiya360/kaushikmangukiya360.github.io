---
title: AI Automation Tool
description: Custom automation solution streamlining repetitive business workflows.
tech: [Python, FastAPI]
role: Freelance Developer
date: 2024-06-01
cover: /assets/img/project-placeholder.png
featured: true
order: 3
---

## Overview

A backend automation service that replaced a client's manual, spreadsheet-driven order-processing workflow with a scheduled pipeline.

## The challenge

Staff were manually copying data between a spreadsheet, an email inbox, and the client's order system every morning — a slow, error-prone process that regularly caused missed or duplicated orders.

## The approach

- Built a FastAPI service that polls the inbox, parses incoming order emails, and validates them against business rules.
- Automated the write-back into the client's order system with a retry queue for transient failures.
- Added a lightweight dashboard so staff could see what was processed automatically versus flagged for review.

## The result

The client removed a daily manual task entirely and eliminated the duplicate-order errors that used to require follow-up calls to customers.

## Stack

Python, FastAPI, PostgreSQL, Celery.
