package image

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/cloudinary/cloudinary-go/v2/transformation"
)

type CloudinaryProvider struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryProvider() (*CloudinaryProvider, error) {
	cloudName := os.Getenv("CLOUDINARY_NAME")
	apiKey := os.Getenv("CLOUDINARY_APIKEY")
	apiSecret := os.Getenv("CLOUDINARY_APISECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return nil, fmt.Errorf("missing required Cloudinary environment variables")
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryProvider{cld: cld}, nil
}

func (c *CloudinaryProvider) Upload(file multipart.File, header *multipart.FileHeader, opts *UploadOptions) (*UploadResult, error) {
	ext := filepath.Ext(header.Filename)
	filename := fmt.Sprintf("%d_%s", time.Now().Unix(), strings.TrimSuffix(header.Filename, ext))

	if opts == nil {
		opts = &UploadOptions{
			Folder: "portfolio",
			Format: "webp",
		}
	}

	uploadParams := uploader.UploadParams{
		PublicID: filename,
		Folder:   opts.Folder,
	}

	if opts.Format != "" {
		uploadParams.Format = opts.Format
	}
	if opts.Width > 0 || opts.Height > 0 {
		transformation := fmt.Sprintf("w_%d,h_%d", opts.Width, opts.Height)
		if opts.Crop != "" {
			transformation += ",c_" + opts.Crop
		}
		uploadParams.Transformation = transformation
	}

	resp, err := c.cld.Upload.Upload(context.Background(), file, uploadParams)
	if err != nil {
		return nil, fmt.Errorf("cloudinary upload failed: %w", err)
	}

	return &UploadResult{
		URL:       resp.SecureURL,
		PublicID:  resp.PublicID,
		Format:    resp.Format,
		Width:     resp.Width,
		Height:    resp.Height,
		Bytes:     resp.Bytes,
		CreatedAt: resp.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (c *CloudinaryProvider) GetOptimizedURL(publicID string, width, height int) string {
	asset, _ := c.cld.Image(publicID)

	transformStr := fmt.Sprintf("w_%d,h_%d,c_fill,q_auto,f_webp", width, height)
	asset.Transformation = transformation.RawTransformation(transformStr)
	url, _ := asset.String()
	return url
}

func (c *CloudinaryProvider) Delete(publicID string) error {
	_, err := c.cld.Upload.Destroy(context.Background(), uploader.DestroyParams{PublicID: publicID})
	return err
}
