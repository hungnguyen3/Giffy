package com.example.androidgiffy;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;

import com.bumptech.glide.Glide;

class ImageAdapter2 extends BaseAdapter {
    private Context mContext;
    private String[] mImageUrls = {
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg",
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg",
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg",
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg",
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg",
            "https://images.dog.ceo/breeds/terrier-tibetan/n02097474_2778.jpg"
    };

    public ImageAdapter2(Context context) {
        mContext = context;
    }

    @Override
    public int getCount() {
        return mImageUrls.length;
    }

    @Override
    public Object getItem(int position) {
        return mImageUrls[position];
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.image_view, parent, false);
        }

        ImageView imageView = convertView.findViewById(R.id.image_view);
        Glide.with(mContext).load(mImageUrls[position]).into(imageView);

        return convertView;
    }
}

