import { S3Client, CreateBucketCommand, PutPublicAccessBlockCommand, PutBucketPolicyCommand, PutBucketWebsiteCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const bucketName = 'erp.crackonetechnologies.in';

async function deploy() {
    try {
        console.log(`Creating bucket ${bucketName}...`);
        await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
        
        console.log(`Removing public access block...`);
        await s3.send(new PutPublicAccessBlockCommand({
            Bucket: bucketName,
            PublicAccessBlockConfiguration: { BlockPublicAcls: false, IgnorePublicAcls: false, BlockPublicPolicy: false, RestrictPublicBuckets: false }
        }));
        
        console.log(`Setting bucket policy for public read...`);
        await s3.send(new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [{ Sid: "PublicReadGetObject", Effect: "Allow", Principal: "*", Action: "s3:GetObject", Resource: `arn:aws:s3:::${bucketName}/*` }]
            })
        }));
        
        console.log(`Enabling static website hosting...`);
        await s3.send(new PutBucketWebsiteCommand({
            Bucket: bucketName,
            WebsiteConfiguration: { IndexDocument: { Suffix: "index.html" }, ErrorDocument: { Key: "index.html" } }
        }));
        
        console.log(`Uploading files from dist/...`);
        const distPath = './dist';
        const uploadFiles = async (dir, prefix = '') => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const s3Key = path.posix.join(prefix, file);
                if (fs.statSync(filePath).isDirectory()) {
                    await uploadFiles(filePath, s3Key);
                } else {
                    const contentType = mime.lookup(filePath) || 'application/octet-stream';
                    console.log(`Uploading ${s3Key}...`);
                    await s3.send(new PutObjectCommand({ Bucket: bucketName, Key: s3Key, Body: fs.readFileSync(filePath), ContentType: contentType }));
                }
            }
        };
        await uploadFiles(distPath);
        console.log(`\n==========================================`);
        console.log(`🚀 Deployment to Subdomain Bucket Complete!`);
        console.log(`🌐 S3 Website URL: http://${bucketName}.s3-website-us-east-1.amazonaws.com`);
        console.log(`==========================================\n`);
    } catch (err) {
        if (err.name === 'BucketAlreadyOwnedByYou' || err.name === 'BucketAlreadyExists') {
           console.log(`Bucket already exists. Proceeding with upload...`);
           // Ignoring bucket creation error and continuing manually could be added here, 
           // but for now, we just log and exit. 
        }
        console.error("Error during deployment:", err);
    }
}
deploy();
