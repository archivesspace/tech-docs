#!/bin/bash

# Define the directory to search
SEARCH_DIR="./docsCOPY"

# Define the front matter to add if missing, including a new line below the closing '---'
FRONT_MATTER="---
layout: default.html
---
"

# Find all markdown files in the directory recursively
find "$SEARCH_DIR" -type f -name "*.md" | while read -r file; do
    # Read the first line of the file
    first_line=$(head -n 1 "$file")

    # Check if the file has front matter
    if [[ "$first_line" != "---" ]]; then
        # Prepend the front matter to the file
        echo "Adding front matter to $file"
        (echo "$FRONT_MATTER"; cat "$file") > "$file.tmp" && mv "$file.tmp" "$file"
    else
        # Read the subsequent lines to find the closing '---'
        closing_found=false
        while IFS= read -r line; do
            if [[ "$line" == "---" ]]; then
                closing_found=true
                break
            fi
        done < <(tail -n +2 "$file")

        if ! $closing_found; then
            # If closing '---' is not found, add the front matter
            echo "Adding front matter to $file"
            (echo "$FRONT_MATTER"; cat "$file") > "$file.tmp" && mv "$file.tmp" "$file"
        else
            echo "Front matter already exists in $file, skipping."
        fi
    fi
done
