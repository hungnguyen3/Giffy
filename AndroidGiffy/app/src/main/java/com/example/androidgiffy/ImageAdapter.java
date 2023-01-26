package com.example.androidgiffy;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import androidx.annotation.NonNull;

import com.bumptech.glide.Glide;
import com.google.gson.Gson;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class ImageAdapter extends BaseAdapter {

    private static final String TAG = "ImageAdapter";

    private final Context mContext;
    private final List<String> mImageUrls;

    public ImageAdapter(@NonNull Context context) {
        mContext = context;
        mImageUrls = new ArrayList<>();
    }

    @Override
    public int getCount() {
        return mImageUrls.size();
    }

    @Override
    public String getItem(int position) {
        return mImageUrls.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Inflate the image_view layout
        View view = LayoutInflater.from(mContext).inflate(R.layout.image_view, parent, false);

        // Find the ImageView in the image_view layout
        ImageView imageView = view.findViewById(R.id.image_view);

        // Load the image into the ImageView using Glide
        Glide.with(mContext).load(mImageUrls.get(position)).into(imageView);

        // Return the image_view layout
        return view;
    }

    public static void fetchImages(final ImageAdapter imageAdapter) {
        new AsyncTask<Void, Void, List<String>>() {
            @Override
            protected List<String> doInBackground(Void... voids) {
                // Make a GET request to the Dog API to fetch a list of images
                OkHttpClient client = new OkHttpClient();
                Request request = new Request.Builder()
                        .url("https://dog.ceo/api/breeds/image/random/6")
                        .build();
                try (Response response = client.newCall(request).execute()) {
                    // Parse the JSON response using Gson
                    Gson gson = new Gson();
                    DogResponse dogResponse = gson.fromJson(response.body().string(), DogResponse.class);
                    // Return the list of images
                    return dogResponse.getMessage();
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            }

            @Override
            protected void onPostExecute(List<String> imageUrls) {
                if (imageUrls != null) {
                    // Add the images to the list
                    imageAdapter.mImageUrls.addAll(imageUrls);
                    // Notify the adapter that the data has changed
                    imageAdapter.notifyDataSetChanged();
                } else {
                    // An error occurred, log the error message
                    Log.e(TAG, "Error fetching images");
                }
            }
        }.execute();
    }

    static void sendImage(MyInputMethodService myInputMethodService, String imageUrl) {
        new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... voids) {
                // Download the image from the URL
                OkHttpClient client = new OkHttpClient();
                Request request = new Request.Builder().url(imageUrl).build();
                try (Response response = client.newCall(request).execute()) {
                    // Convert the image to a byte array
                    byte[] imageBytes = response.body().bytes();
                    // Create a new intent to send to the target application
                    Intent sendIntent = new Intent();
                    // Set the MIME type to image/*
                    sendIntent.setType("image/*");
                    // Add the image bytes as an extra
                    sendIntent.putExtra(Intent.EXTRA_STREAM, imageBytes);
                    // Add the FLAG_ACTIVITY_NEW_TASK flag to the intent
                    sendIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    // Send the intent
                    myInputMethodService.startActivity(Intent.createChooser(sendIntent, "Send image"));
                } catch (IOException e) {
                    // An error occurred, log the error message
                    Log.e(TAG, "Error sending image", e);
                }
                return null;
            }
        }.execute();
    }
}
