package com.example.androidgiffy;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.GridView;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Find the GridView in the layout
        GridView gridView = findViewById(R.id.grid_view_main);

        // Create a new ImageAdapter
        ImageAdapter imageAdapter = new ImageAdapter(this);

        // Set the ImageAdapter as the adapter for the GridView
        gridView.setAdapter(imageAdapter);

        // Fetch and display images from the Dog API
        imageAdapter.fetchImages();
    }
}
