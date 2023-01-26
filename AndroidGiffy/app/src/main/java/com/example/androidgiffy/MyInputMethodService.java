package com.example.androidgiffy;

import static androidx.core.app.ActivityCompat.requestPermissions;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.inputmethodservice.InputMethodService;
import android.inputmethodservice.KeyboardView;
import android.os.AsyncTask;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.GridView;

import androidx.core.content.ContextCompat;

import java.io.IOException;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class MyInputMethodService extends InputMethodService implements KeyboardView.OnKeyboardActionListener {
    private static final String TAG = "MyInputMethodService";

    @Override
    public View onCreateInputView() {
        // Inflate the keyboard layout
        View keyboardView = getLayoutInflater().inflate(R.layout.keyboard_layout, null);

        // Find the GridView or RecyclerView in the keyboard layout
        GridView gridView = keyboardView.findViewById(R.id.grid_view);

        // Create a new ImageAdapter
        ImageAdapter imageAdapter = new ImageAdapter(this);

        // Set the ImageAdapter as the adapter for the GridView
        gridView.setAdapter(imageAdapter);

        MyInputMethodService that = this;

        gridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                // Get the image url from the adapter
                String imageUrl = imageAdapter.getItem(i);
                // Send the image to the target application
                // Create a new intent to send to the target application
                Intent sendIntent = new Intent();
                // Set the MIME type to text/*
                sendIntent.setType("text/*");
                // Add the image URL as an extra
                sendIntent.putExtra(Intent.EXTRA_TEXT, imageUrl);
                // Add the FLAG_ACTIVITY_NEW_TASK flag to the intent
                sendIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                // Send the intent
                that.startActivity(Intent.createChooser(sendIntent, "Send image URL"));
            }
        });

        // Fetch and display images of dogs from the Dog API
        imageAdapter.fetchImages(imageAdapter);

        // Return the keyboard layout
        return keyboardView;
    }

    @Override
    public void onPress(int i) {

    }

    @Override
    public void onRelease(int i) {

    }

    @Override
    public void onKey(int primaryCode, int[] keyCodes) {

    }

    @Override
    public void onText(CharSequence charSequence) {

    }

    @Override
    public void swipeLeft() {

    }

    @Override
    public void swipeRight() {

    }

    @Override
    public void swipeDown() {

    }

    @Override
    public void swipeUp() {

    }
}
