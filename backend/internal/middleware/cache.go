package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/redis/go-redis/v9"
)

func RedisCache(client *redis.Client, key string, ttl time.Duration, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// Try to get cached response
		cached, err := client.Get(ctx, key).Result()
		if err == nil {
			// Cache hit
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(cached))
			return
		}

		// Cache miss: capture response
		rec := NewResponseRecorder(w)
		handler(rec, r)

		// Only cache successful responses
		if rec.StatusCode == http.StatusOK {
			client.Set(ctx, key, rec.Body.String(), ttl)
		}
	}
}

func RemoveCache(client *redis.Client, key string, handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rec := NewResponseRecorder(w)
		handler(rec, r)

		// Only refresh if success
		if rec.StatusCode >= 200 && rec.StatusCode < 300 {
			// Refresh the cache using the captured body
			err := client.Del(r.Context(), key).Err()
			if err != nil {
				fmt.Println("⚠️ Failed to refresh cache:", err)
			} else {
				fmt.Println("✅ Refreshed cache key:", key)
			}
		}
	}
}
