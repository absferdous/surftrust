// /src-jsx/builder/components/PostSelector.js
import React, { useState, useRef, useCallback } from "react";
import apiFetch from "@wordpress/api-fetch";
import { FormTokenField, Spinner, Notice } from "@wordpress/components";
import { useDebounce } from "@wordpress/compose";

const PostSelector = ({ label, value = [], onChange, maxSuggestions = 20 }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use Map for O(1) lookups and automatic deduplication
  const postsCache = useRef(new Map());
  const abortControllerRef = useRef(null);

  const valueAsTitles = value.map((post) => post.title);

  // Memoized search function with proper cleanup
  const performSearch = useCallback(
    async (searchTerm) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        setIsLoading(true);
        setError(null);

        const posts = await apiFetch({
          path: `/surftrust/v1/search-posts?search=${encodeURIComponent(
            searchTerm
          )}&limit=${maxSuggestions}`,
          signal: abortControllerRef.current.signal,
        });

        // Update cache with new results
        posts.forEach((post) => {
          postsCache.current.set(post.id, post);
        });

        const postTitles = posts.map((post) => post.title);
        setSuggestions(postTitles);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to search posts. Please try again.");
          console.error("Search error:", err);
        }
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [maxSuggestions]
  );

  const debouncedSearch = useDebounce(performSearch, 400);

  const handleInputChange = (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    debouncedSearch(input);
  };

  const handleTokenChange = (selectedTitles) => {
    const newSelectedPosts = selectedTitles
      .map((title) => {
        // Find in current selection first (maintains existing objects)
        const existingPost = value.find((p) => p.title === title);
        if (existingPost) return existingPost;

        // Find in cache
        const cachedPost = Array.from(postsCache.current.values()).find(
          (post) => post.title === title
        );

        if (cachedPost) {
          return { id: cachedPost.id, title: cachedPost.title };
        }

        // Post not found - could show warning or filter out
        console.warn(`Post not found: "${title}"`);
        return null;
      })
      .filter(Boolean); // Remove null entries

    onChange(newSelectedPosts);
  };

  const handleTokenRemove = (removedTitle) => {
    // Optional: Add specific removal logic if needed
    console.log(`Removed: ${removedTitle}`);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <FormTokenField
        label={label}
        value={valueAsTitles}
        suggestions={suggestions}
        onInputChange={handleInputChange}
        onChange={handleTokenChange}
        onTokenRemove={handleTokenRemove}
        __experimentalShowHowTo={false}
        placeholder="Type to search for posts..."
        maxSuggestions={maxSuggestions}
      />

      {isLoading && <Spinner style={{ margin: "8px 0 0 8px" }} />}

      {error && (
        <Notice status="error" isDismissible onRemove={() => setError(null)}>
          {error}
        </Notice>
      )}

      {suggestions.length === 0 && !isLoading && valueAsTitles.length > 0 && (
        <div style={{ fontSize: "12px", color: "#757575", marginTop: "4px" }}>
          {value.length} post(s) selected
        </div>
      )}
    </div>
  );
};

export default PostSelector;
