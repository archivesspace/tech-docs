---
title: Best Practices for Data Migration into ArchivesSpace
description: Migrating archival data is complex work. Drawing on lessons from dozens of institutional migrations, we outline the strategies and tools that lead to the smoothest transitions into ArchivesSpace.
pubDate: 2026-01-10
authors:
  - Priya Nair
---

Every migration is different, but successful ones tend to follow a similar path: understand your source data, plan the mapping, validate early and often, and migrate in phases.

## Know your source

Before touching ArchivesSpace, document what you're migrating. What's the structure of your EAD files or database? What controlled vocabularies do you use? Are there custom fields or local conventions that don't map cleanly? A data audit saves time later.

## Map carefully

ArchivesSpace has a specific data model. Resource records, archival objects, accessions, and agents each have required and optional fields. Create a mapping document that shows how each source field maps to ArchivesSpace, and note any transformations (e.g., date format changes, split or merged fields).

## Validate early

Don't wait until the final load to validate. Run small test migrations and spot-check the results in the staff interface. Use the migration tools documented in the [Migrations](/migrations/migration_tools) section to catch problems before they multiply.

## Phased migration

Migrate in batches—by collection, series, or date range. This makes it easier to track progress, fix issues in earlier batches, and avoid overwhelming the system. Many institutions migrate accessions first, then resources and archival objects.

## Get help

The ArchivesSpace community has done this many times. Check the [migration guides](/migrations/migrate_from_archivists_toolkit) and reach out on the [Community Forum](https://archivesspace.atlassian.net/wiki/spaces/ADC/overview) if you're stuck.
