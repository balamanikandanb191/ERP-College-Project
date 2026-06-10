import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
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

const bucketName = 'crackonetechnologies.in';
const folderPrefix = 'college-erp/';

async function deploy() {
    try {
        console.log(`Uploading files from dist/ to s3://${bucketName}/${folderPrefix}...`);
        const distPath = './dist';
        
        const uploadFiles = async (dir, currentPrefix = '') => {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const filePath = path.join(dir, file);
                const s3Key = path.posix.join(folderPrefix, currentPrefix, file);
                
                if (fs.statSync(filePath).isDirectory()) {
                    await uploadFiles(filePath, path.posix.join(currentPrefix, file));
                } else {
                    const contentType = mime.lookup(filePath) || 'application/octet-stream';
                    console.log(`Uploading ${s3Key}...`);
                    await s3.send(new PutObjectCommand({ 
                        Bucket: bucketName, 
                        Key: s3Key, 
                        Body: fs.readFileSync(filePath), 
                        ContentType: contentType 
                    }));
                }
            }
        };
        
        await uploadFiles(distPath);
        console.log(`\n==========================================`);
        console.log(`🚀 Deployment to Sub-path Complete!`);
        console.log(`🌐 Website URL: https://${bucketName}/${folderPrefix}`);
        console.log(`==========================================\n`);
    } catch (err) {
        console.error("Error during deployment:", err);
    }
}
deploy();
